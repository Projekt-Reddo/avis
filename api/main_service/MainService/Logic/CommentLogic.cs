using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Logic;

public interface ICommentLogic
{
    Task<bool> UploadNewComment(Comment comment, Stream stream, string contentType, string fileExtension,
    string folderUpload, string mediaType);
    Task<bool> UpdateComment(string commentId, Comment comment);
    Task<bool> UpdatePostComment(string postId, Comment comment);
    Task<Comment> GetCommentById(string commentId);
    Task<(long total, IEnumerable<Comment>)> GetComments(string queryId, bool IsPostChild, int Size, int skipPage);
	Task<bool> VoteComment(string userId, string commentId, bool isUpVote);
	Task<VoteResponeDto> CommentVoteCount(string commentId);
}

public class CommentLogic : ICommentLogic
{
	private readonly IS3Service _s3Service;
	private readonly IConfiguration _configuration;
	private readonly ICommentRepo _commentRepo;
	private readonly IPostRepo _postRepo;

	public CommentLogic(IS3Service s3Service, IConfiguration configuration, ICommentRepo commentRepo, IPostRepo postRepo)
	{
		_s3Service = s3Service;
		_configuration = configuration;
		_commentRepo = commentRepo;
		_postRepo = postRepo;
	}

	public async Task<bool> UploadNewComment(Comment Comment, Stream stream, string contentType, string fileExtension,
		string folderUpload, string mediaType)
	{
		(var commentUploadStatus, var commentUrl) = await _s3Service.UploadFileAsync(
			_configuration.GetValue<string>("S3:ResourcesBucket"),
			folderUpload,
			$"{Comment.Id}{fileExtension}",
			stream,
			contentType,
			null!
		);

		if (commentUploadStatus is false)
		{
			return false;
		}

		Comment.Media.Url = commentUrl;
		Comment.Media.MediaType = mediaType;
		Comment.Media.MimeType = contentType;
		var rs = await UpdateComment(Comment.Id, Comment);
		return rs;
	}
	public async Task<bool> UpdateComment(string commentId, Comment comment)
	{
		var rs = await _commentRepo.ReplaceOneAsync(commentId, comment);
		return rs;
	}

	public async Task<bool> UpdatePostComment(string postId, Comment comment)
	{
		var postFilter = Builders<Post>.Filter.Eq(x => x.Id, postId);
		var postFromRepo = await _postRepo.FindOneAsync(filter: postFilter);
		if (postFromRepo.CommentIds == null)
		{
			postFromRepo.CommentIds = new List<ObjectId>();
		}

		postFromRepo.CommentIds.Add(new ObjectId(comment.Id));
		var rs = await _postRepo.ReplaceOneAsync(postId, postFromRepo);
		return rs;
	}

	public FilterDefinition<Comment> CommentFilterId(string commentId)
	{
		var commentFilter = Builders<Comment>.Filter.Empty;
		commentFilter = commentFilter & Builders<Comment>.Filter.Where(x => x.Id == commentId);
		return commentFilter;
	}

	public async Task<Comment> GetCommentById(string commentId)
	{
		BsonDocument lookup = new BsonDocument{
						{ "from", "account" },
						{ "localField", "UserId" },
						{ "foreignField", "_id" },
						{ "as", "Users" },
					};
		var commentFilter = CommentFilterId(commentId);

		// Config to specify needed fields
		BsonDocument project = new BsonDocument{
					{"_id", 1},
					{"CreatedAt", 1},
					{"ModifiedAt", 1},
					{"Content", 1},
					{ "UserId", 1},
						{ "User", new BsonDocument{
						{"$arrayElemAt",
							new BsonArray{ "$Users", 0 }
						},
					}},
					{"UpvotedBy", 1},
					{"DownvotedBy", 1},
					{"Media", 1},
					{"Comments", 1}
			};

		var commentFromRepo = await _commentRepo.FindOneAsync(filter: commentFilter, lookup:lookup, project: project);

		return commentFromRepo;
	}

	public async Task<(long total, IEnumerable<Comment>)> GetComments(string queryId, bool IsPostChild, int Size, int skipPage)
	{
		BsonDocument lookup = new BsonDocument{
						{ "from", "account" },
						{ "localField", "UserId" },
						{ "foreignField", "_id" },
						{ "as", "Users" },
					};

		// Config to specify needed fields
		BsonDocument project = new BsonDocument{
					{"_id", 1},
					{"CreatedAt", 1},
					{"ModifiedAt", 1},
					{"Content", 1},
					{ "UserId", 1},
						{ "User", new BsonDocument{
						{"$arrayElemAt",
							new BsonArray{ "$Users", 0 }
						},
					}},
					{"UpvotedBy", 1},
					{"DownvotedBy", 1},
					{"Media", 1},
					{"Comments", 1}
			};
		var filterComments = Builders<Comment>.Filter.Empty;
		if (IsPostChild)
		{
			// loop into post comments to get comment ids
			var postFromRepo = await _postRepo.FindOneAsync(filter: Builders<Post>.Filter.Eq(x => x.Id, queryId));

			filterComments = Builders<Comment>.Filter.In("_id", postFromRepo.CommentIds);
		}
		else
		{
			// loop into parent comments to get child comment ids
			var commentFromRepo = await _commentRepo.FindOneAsync(filter: Builders<Comment>.Filter.Eq(x => x.Id, queryId));
			filterComments = Builders<Comment>.Filter.In("_id", commentFromRepo.Comments);
		}
		(var totals, var comments) = await _commentRepo.FindManyAsync(filter: filterComments, lookup: lookup, project: project,
				limit: Size,
				skip: skipPage
				);

		return (totals, comments);
	}

	public async Task<bool> VoteComment(string userId, string commentId, bool isUpVote)
	{
		var filter = Builders<Comment>.Filter.Eq(p => p.Id, commentId);

		var comment = await _commentRepo.FindOneAsync(filter: filter);

		if(comment.UpvotedBy == null)
		{
			comment.UpvotedBy = new List<string>();
		}

		if(comment.DownvotedBy == null)
		{
			comment.DownvotedBy = new List<string>();
		}

		if (comment.UpvotedBy.Contains(userId))
		{

			comment.UpvotedBy.Remove(userId);

			if (!isUpVote)
			{
				comment.DownvotedBy.Add(userId);
			}

			await _commentRepo.ReplaceOneAsync(commentId, comment);

			return true;
		}
		else if (comment.DownvotedBy.Contains(userId))
		{

			comment.DownvotedBy.Remove(userId);

			if (isUpVote)
			{
				comment.UpvotedBy.Add(userId);
			}

			await _commentRepo.ReplaceOneAsync(commentId, comment);

			return true;
		}
		else
		{

			if (isUpVote)
			{

				comment.UpvotedBy.Add(userId);

			}
			else
			{

				comment.DownvotedBy.Add(userId);

			}

			await _commentRepo.ReplaceOneAsync(commentId, comment);

			return true;
		}
	}

	public async Task<VoteResponeDto> CommentVoteCount(string commentId)
		{
			var filter = Builders<Comment>.Filter.Eq(p => p.Id, commentId);

			var comment = await _commentRepo.FindOneAsync(filter: filter);

			VoteResponeDto res = new VoteResponeDto();

			res.UpVote = comment.UpvotedBy;

			res.DownVote = comment.DownvotedBy;

			return res;
		}
}