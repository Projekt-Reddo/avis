using System.Collections.Immutable;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Utils;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Logic;

public interface IPostLogic
{
	Task<Post?> GetPostById(string id);
	Task<bool> VotePost(string userId, string voteId, bool isUpVote);
	Task<VoteResponeDto> PostVoteCount(string postId);
	Task<int> SavePost(string postId, string userId);
	Task<bool> DeletePost(string id);
	Task<(long total, IEnumerable<Post> entities)> ViewPost(string userId, PaginationReqDto<PostFilterDto> pagination);
	Task<(long total, IEnumerable<Post> entities)> ViewUserPost(string userId, PaginationReqDto<UserPostFilterDto> pagination);
	Task<(long total, IEnumerable<Post> entities)> ViewSavedPost(List<string> postIds, PaginationReqDto<PostFilterDto> pagination);
}

public class PostLogic : IPostLogic
{
	private readonly IPostRepo _postRepo;
	private readonly IAccountRepo _accountRepo;
	private readonly IConfiguration _configuration;

	private readonly List<BsonDocument> userLookUp = new List<BsonDocument>(){
		new BsonDocument
		{
			{
				"$lookup", new BsonDocument{
					{ "from", "account" },
					{ "localField", "UserId" },
					{ "foreignField", "_id" },
					{ "as", "User" }
				}
			}
		},
		new BsonDocument {
			{ "$unwind", "$User" }
		}
	};

	private readonly BsonDocument viewPostLookup = new BsonDocument{
				{ "from", "account" },
				{ "localField", "UserId" },
				{ "foreignField", "_id" },
				{ "as", "Users" }
			};

	private readonly BsonDocument viewPostProject = new BsonDocument{
				{ "_id", 1 },
				{ "User", new BsonDocument{
					{"$arrayElemAt",
						new BsonArray{ "$Users", 0 }
					},
				}},
				{ "Content", 1},
				{ "Medias",  new BsonDocument{
					{"_id" , 1},
					{"MediaType" , 1},
					{"Url" , 1}
				}},
				{ "CreatedAt", 1 },
				{ "ModifiedAt", 1 },
				{ "PublishedAt", 1 },
				{ "UpvotedBy", 1 },
				{ "DownvotedBy", 1 },
				{ "Hashtags", 1},
				{ "CommentIds", 1},
			};

	private readonly BsonDocument viewPostSort = new BsonDocument{
				{ "PublishedAt", -1 },
				{ "_id", 1 }
			};

	public PostLogic(IPostRepo postRepo, IConfiguration configuration, IAccountRepo accountRepo)
	{
		_postRepo = postRepo;
		_accountRepo = accountRepo;
		_configuration = configuration;

	}

	public async Task<Post?> GetPostById(string id)
	{
		var filter = Builders<Post>.Filter.Eq(x => x.Id, id)
					 & Builders<Post>.Filter.Not(Builders<Post>.Filter.Eq(x => x.IsDeleted, true));

		IEnumerable<BsonDocument> stages = new List<BsonDocument>();

		stages = stages.Concat(userLookUp);

		var post = await _postRepo.FindOneAsync(filter: filter, stages: stages);
		return post;
	}

	public async Task<VoteResponeDto> PostVoteCount(string postId)
	{
		var filter = Builders<Post>.Filter.Eq(p => p.Id, postId);

		var post = await _postRepo.FindOneAsync(filter: filter);

		VoteResponeDto res = new VoteResponeDto();

		res.UpVote = post.UpvotedBy;

		res.DownVote = post.DownvotedBy;

		return res;
	}

	public async Task<bool> VotePost(string userId, string postId, bool isUpVote)
	{

		var filter = Builders<Post>.Filter.Eq(p => p.Id, postId);

		var post = await _postRepo.FindOneAsync(filter: filter);

		if (post.UpvotedBy == null)
		{
			post.UpvotedBy = new List<string>();
		}

		if (post.DownvotedBy == null)
		{
			post.DownvotedBy = new List<string>();
		}

		if (post.UpvotedBy.Contains(userId))
		{

			post.UpvotedBy.Remove(userId);

			if (!isUpVote)
			{
				post.DownvotedBy.Add(userId);
			}

			await _postRepo.ReplaceOneAsync(postId, post);

			return true;

		}
		else if (post.DownvotedBy.Contains(userId))
		{

			post.DownvotedBy.Remove(userId);

			if (isUpVote)
			{
				post.UpvotedBy.Add(userId);
			}

			await _postRepo.ReplaceOneAsync(postId, post);

			return true;

		}
		else
		{

			if (isUpVote)
			{

				post.UpvotedBy.Add(userId);

			}
			else
			{

				post.DownvotedBy.Add(userId);

			}

			await _postRepo.ReplaceOneAsync(postId, post);

			return true;
		}
	}

	public async Task<int> SavePost(string postId, string userId)
	{

		var userFilter = Builders<Account>.Filter.Eq(u => u.Id, userId);

		var user = await _accountRepo.FindOneAsync(userFilter);

		if (user.SavedPosts == null)
		{
			user.SavedPosts = new List<ObjectId>();
		}

		if (user.SavedPosts.Contains(new ObjectId(postId)))
		{
			return 0;
		}
		else
		{
			user.SavedPosts.Add(new ObjectId(postId));
		}

		await _accountRepo.ReplaceOneAsync(userId, user);

		return 1;

	}

	public async Task<bool> DeletePost(string id)
	{
		var filter = Builders<Post>.Filter.Eq(x => x.Id, id) & Builders<Post>.Filter.Eq(x => x.IsDeleted, false);
		var post = await _postRepo.FindOneAsync(filter: filter);
		if (post is null)
		{
			return false;
		}

		var update = Builders<Post>.Update.Set(x => x.IsDeleted, true);
		var rs = await _postRepo.UpdateOneAsync(filter: filter, update: update);
		return rs;
	}

	public async Task<(long total, IEnumerable<Post> entities)> ViewPost(string? userId, PaginationReqDto<PostFilterDto> pagination)
	{
		// Create Post Filter
		var postFilter = Builders<Post>.Filter.Empty;

		// Is Deleted Post Filter
		postFilter = postFilter & Builders<Post>.Filter.Eq(x => x.IsDeleted, false);

		// Public Post Filter
		postFilter = postFilter & Builders<Post>.Filter.Eq(x => x.DisplayStatus, PostStatus.PUBLIC);

		// Published At Filter
		postFilter = postFilter & Builders<Post>.Filter.Lte(x => x.PublishedAt, DateTime.Now);

		// Private Post Filter
		if (userId != null)
		{
			postFilter = postFilter | Builders<Post>.Filter.Eq(x => x.DisplayStatus, PostStatus.PRIVATE)
									& Builders<Post>.Filter.Eq(x => x.UserId, userId)
									& Builders<Post>.Filter.Eq(x => x.IsDeleted, false);
		}

		// Hashtags Filter
		if (pagination.Filter.Hashtags != null)
		{
			List<string> hashtagsNormal = new List<string>();

			foreach (var hashtag in pagination.Filter.Hashtags!)
			{
				hashtagsNormal.Add(HelperClass.RemoveDiacritics(hashtag).ToUpper());
			}

			postFilter = postFilter & Builders<Post>.Filter.All(x => x.HashtagsNormalized, hashtagsNormal);
		}

		// Trending Post Filter
		if (pagination.Filter.IsTrending)
		{
			postFilter = postFilter & Builders<Post>.Filter.Where(x => x.UpvotedBy.Count() >= 1);
		}

		// Pagination formula
		var skipPage = (pagination.Page - 1) * pagination.Size;

		// Handle full text search if content field is null or empty
		if (!String.IsNullOrWhiteSpace(pagination.Filter.Content))
		{
			// Create full text search filter
			var searchfilter = new BsonDocument {
						{ "index", _configuration["DbIndexs:Post"] },
						{ "text", new BsonDocument {
							{ "query", pagination.Filter.Content },
							{ "path", new BsonDocument {
								{ "wildcard", "*" }
						}},
					}}
				};

			(var _, var postsFromRepoFTS) = await _postRepo.FindManyAsync(
				indexFilter: searchfilter,
				filter: postFilter,
				lookup: viewPostLookup,
				project: viewPostProject,
				sort: viewPostSort,
				limit: pagination.Size,
				skip: skipPage);

			IEnumerable<BsonDocument> stages = new List<BsonDocument>();

			var totalPostFTS = await _postRepo.CountDocumentAsync(
				filter: searchfilter,
				stages: stages);

			return (totalPostFTS, postsFromRepoFTS);
		}

		(var totalPost, var postsFromRepo) = await _postRepo.FindManyAsync(
			filter: postFilter,
			lookup: viewPostLookup,
			project: viewPostProject,
			sort: viewPostSort,
			limit: pagination.Size,
			skip: (pagination.Page - 1) * pagination.Size); // Pagination formula

		return (totalPost, postsFromRepo);
	}

	public async Task<(long total, IEnumerable<Post> entities)> ViewUserPost(string userId, PaginationReqDto<UserPostFilterDto> pagination)
	{
		// Create Post Filter
		var postFilter = Builders<Post>.Filter.Empty;

		// Is Deleted Post Filter
		postFilter = postFilter & Builders<Post>.Filter.Eq(x => x.IsDeleted, false);

		// User Post Filter
		postFilter = postFilter & Builders<Post>.Filter.Eq(x => x.UserId, pagination.Filter.UserId);

		// Public Post Filter
		postFilter = postFilter & Builders<Post>.Filter.Eq(x => x.DisplayStatus, PostStatus.PUBLIC);

		// Published At Filter
		postFilter = postFilter & Builders<Post>.Filter.Lte(x => x.PublishedAt, DateTime.Now);

		// Private Post Filter
		if (userId == pagination.Filter.UserId)
		{
			postFilter = postFilter | Builders<Post>.Filter.Eq(x => x.DisplayStatus, PostStatus.PRIVATE)
									& Builders<Post>.Filter.Eq(x => x.UserId, userId)
									& Builders<Post>.Filter.Eq(x => x.IsDeleted, false);
		}

		(var totalPost, var postsFromRepo) = await _postRepo.FindManyAsync(
			filter: postFilter,
			lookup: viewPostLookup,
			project: viewPostProject,
			sort: viewPostSort,
			limit: pagination.Size,
			skip: (pagination.Page - 1) * pagination.Size); // Pagination formula

		return (totalPost, postsFromRepo);
	}
	public async Task<(long total, IEnumerable<Post> entities)> ViewSavedPost(List<string> postIds, PaginationReqDto<PostFilterDto> pagination)
	{
		// Create Post Filter
		var postFilter = Builders<Post>.Filter.Empty;

		postFilter = postFilter & Builders<Post>.Filter.In(p => p.Id, postIds)
								& Builders<Post>.Filter.Eq(x => x.IsDeleted, false);

		(var totalPost, var postsFromRepo) = await _postRepo.FindManyAsync(
			filter: postFilter,
			lookup: viewPostLookup,
			project: viewPostProject,
			sort: viewPostSort,
			limit: pagination.Size,
			skip: (pagination.Page - 1) * pagination.Size); // Pagination formula

		return (totalPost, postsFromRepo);
	}
}
