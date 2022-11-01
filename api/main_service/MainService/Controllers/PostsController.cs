using AutoMapper;
using Hangfire;
using MainService.Data;
using MainService.Dtos;
using MainService.Logic;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
	private readonly IMapper _mapper;
	private readonly IPostRepo _postRepo;
	private readonly IAccountRepo _accountRepo;
	private readonly IConfiguration _configuration;
	private readonly IPostLogic _postLogic;
	private readonly ICommentLogic _commentLogic;
	private readonly IS3Service _s3Service;
	private readonly IBackgroundJobClient _backgroundJobClient;

	public PostsController(
		IMapper mapper,
		IPostRepo postRepo,
		IConfiguration configuration,
		IPostLogic postLogic,
		IAccountRepo accountRepo,
		IS3Service s3Service,
		ICommentLogic commentLogic,
		IBackgroundJobClient backgroundJobClient
	)
	{
		_mapper = mapper;
		_postRepo = postRepo;
		_configuration = configuration;
		_postLogic = postLogic;
		_accountRepo = accountRepo;
		_s3Service = s3Service;
		_commentLogic = commentLogic;
		_backgroundJobClient = backgroundJobClient;

	}

	/// <summary>
	/// Create a new post in database
	/// </summary>
	/// <param name="newPost">Post information</param>
	/// <returns>200 / 400 / 404</returns>
	[Authorize]
	[HttpPost]
	public async Task<ActionResult<ResponseDto>> AddPost([FromForm] PostCreateDto newPost)
	{
		if (String.IsNullOrWhiteSpace(newPost.Content) && newPost.Medias == null)
		{
			return BadRequest(new ResponseDto(400, ResponseMessage.POST_EMPTY_CONTENT_MEDIA));
		}

		var userId = "";

		// Get User Id
		try
		{
			userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value;

			// To check whether account exist or not.
			var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Uid", userId));

			// Account not found
			if (accountFromRepo is null)
			{
				return NotFound(new ResponseDto(404, ResponseMessage.ACCOUNT_NOT_FOUND));
			}
		}
		catch (Exception)
		{
			userId = null;
		}

		// Mapping Post
		var post = _mapper.Map<Post>(newPost);

		post.UserId = userId!;
		post.CreatedAt = DateTime.Now;
		post.PublishedAt = newPost.PublishedAt ?? DateTime.Now;
		post.HashtagsNormalized = new List<string>();

		// Normalizing Hashtags
		if (newPost.HashTags != null)
		{
			List<string> hashtagsNormal = new List<string>();

			foreach (var hashtag in newPost.HashTags!)
			{
				hashtagsNormal.Add(HelperClass.RemoveDiacritics(hashtag).ToUpper());
			}

			post.HashtagsNormalized = hashtagsNormal;
		}

		// Handle upload file to AWS
		if (newPost.Medias != null)
		{
			List<Media> medias = new List<Media>();

			foreach (var media in newPost.Medias)
			{
				// Check files type
				(var isMp3File, var songCheckMessage) = FileExtension.CheckMp3Extension(media);
				(var isImageFile, var imageCheckMessage) = FileExtension.CheckImageExtension(media);
				(var isVideoFile, var videoCheckMessage) = FileExtension.CheckVideoExtension(media);

				if (!isMp3File && !isImageFile && !isVideoFile)
				{
					return BadRequest(new ResponseDto(400, ResponseMessage.POST_CREATE_MEDIA_TYPE));
				}

				var mediaType = "";
				var folderUpload = "";

				if (isMp3File)
				{
					folderUpload = S3Config.AUDIOS_FOLDER;
					mediaType = "audio";
				}

				if (isImageFile)
				{
					folderUpload = S3Config.IMAGES_FOLDER;
					mediaType = "image";
				}

				if (isVideoFile)
				{
					folderUpload = S3Config.VIDEOS_FOLDER;
					mediaType = "video";
				}

				var newMedia = new Media()
				{
					Id = ObjectId.GenerateNewId().ToString()
				};

				(var fileUploadStatus, var fileUrl) = await _s3Service.UploadFileAsync(
						_configuration.GetValue<string>("S3:ResourcesBucket"),
						folderUpload,
						$"{newMedia.Id}{FileExtension.GetFileExtension(media)}",
						media.OpenReadStream(),
						media.ContentType,
						null!
					);

				if (fileUploadStatus is false)
				{
					return BadRequest(new ResponseDto(400, ResponseMessage.POST_UPLOAD_FILE_FAIL));
				}

				newMedia.Url = fileUrl;
				newMedia.MediaType = mediaType;
				newMedia.MimeType = media.ContentType;

				medias.Add(newMedia);
			}

			post.Medias = medias;
		}

		// Insert new Post to Database
		var rs = await _postRepo.AddOneAsync(post);

		if (newPost.PublishedAt is not null)
		{
			_backgroundJobClient.Schedule(() =>
				UpdatePostStatus(rs.Id, new PostStatusUpdateDto(PostStatus.PUBLIC)),
				DateTimeOffset.Parse(newPost.PublishedAt.ToString()!));
		}

		return Ok(new ResponseDto(200, ResponseMessage.POST_CREATE_SUCCESS));
	}

	/// <summary>
	/// Get all post in database with filter and pagination
	/// </summary>
	/// <param name="pagination">Pagination metrics and Search filters</param>
	/// <returns>200 / 400 / 404</returns>
	[HttpPost("filter")]
	public async Task<ActionResult<PaginationResDto<IEnumerable<PostReadDto>>>> ViewPost(PaginationReqDto<PostFilterDto> pagination)
	{
		var userId = "";

		// Create Post Filter
		var postFilter = Builders<Post>.Filter.Empty;

		// Is Deleted Post Filter
		postFilter = postFilter & Builders<Post>.Filter.Eq(x => x.IsDeleted, !PostStatus.DELETED);

		// Public Post Filter
		postFilter = postFilter & Builders<Post>.Filter.Eq(x => x.DisplayStatus, PostStatus.PUBLIC);

		// Published At Filter
		postFilter = postFilter & Builders<Post>.Filter.Lte(x => x.PublishedAt, DateTime.Now);

		// Get User Id
		try
		{
			userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value;
		}
		catch (Exception)
		{
			userId = null;
		}

		// Private Post Filter
		if (userId != null)
		{
			postFilter = postFilter | Builders<Post>.Filter.Eq(x => x.DisplayStatus, PostStatus.PRIVATE) & Builders<Post>.Filter.Eq(x => x.UserId, userId) & postFilter & Builders<Post>.Filter.Eq(x => x.IsDeleted, !PostStatus.DELETED); ;
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

		// Config to get User own the Post
		BsonDocument lookup = new BsonDocument{
				{ "from", "account" },
				{ "localField", "UserId" },
				{ "foreignField", "_id" },
				{ "as", "Users" }
			};

		// Config to specify needed fields
		BsonDocument project = new BsonDocument{
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

		// Config to sort created date decrease
		BsonDocument sort = new BsonDocument{
				{ "PublishedAt", -1 },
				{ "_id", 1 }
			};

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
				lookup: lookup,
				project: project,
				sort: sort,
				limit: pagination.Size,
				skip: skipPage);

			IEnumerable<BsonDocument> stages = new List<BsonDocument>();

			var totalPostFTS = await _postRepo.CountDocumentAsync(
				filter: searchfilter,
				stages: stages);

			var postsFTS = _mapper.Map<IEnumerable<ListPostDto>>(postsFromRepoFTS);

			return Ok(new PaginationResDto<ListPostDto>((Int32)totalPostFTS, postsFTS));
		}

		(var totalPost, var postsFromRepo) = await _postRepo.FindManyAsync(
			filter: postFilter,
			lookup: lookup,
			project: project,
			sort: sort,
			limit: pagination.Size,
			skip: skipPage);

		var posts = _mapper.Map<IEnumerable<ListPostDto>>(postsFromRepo);

		return Ok(new PaginationResDto<ListPostDto>((Int32)totalPost, posts));
	}

	[HttpGet("recommend")]
	public async Task<ActionResult<HashtagsRecommend>> RecommendTag()
	{
		// Create Post Filter
		var postFilter = Builders<Post>.Filter.Empty;

		// Published At Filter
		postFilter = postFilter & Builders<Post>.Filter.Gte(x => x.PublishedAt, DateTime.Now.AddDays(-7));
		postFilter = postFilter & Builders<Post>.Filter.Lte(x => x.PublishedAt, DateTime.Now);

		// Config to specify needed fields
		BsonDocument project = new BsonDocument{
				{ "_id", 0 },
				{ "Hashtags", 1},
			};

		(var _, var postsFromRepo) = await _postRepo.FindManyAsync(
			filter: postFilter,
			project: project);

		HashSet<string> randomHashtags = new HashSet<string>();

		List<string> popularHashtags = new List<string>();

		foreach (var post in postsFromRepo)
		{
			HashSet<string> postHashtags = new HashSet<string>(post.Hashtags);
			randomHashtags.UnionWith(postHashtags);
			popularHashtags.AddRange(post.Hashtags);
		}

		var commonHashtag = popularHashtags.GroupBy(p => p)
					.OrderByDescending(g => g.Count())
					.First()
					.Key;


		return Ok(new HashtagsRecommend(commonHashtag, randomHashtags));
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<PostReadDto>> GetPostById(string id)
	{
		var post = await _postLogic.GetPostById(id);

		if (post is null)
		{
			return BadRequest(new ResponseDto(404));
		}
		return _mapper.Map<PostReadDto>(post);
	}

	[HttpPut("status/{id}")]
	public async Task<ActionResult<ResponseDto>> UpdatePostStatus(string id, PostStatusUpdateDto postStatusUpdateDto)
	{

		var post = await _postLogic.GetPostById(id);

		if (post is null)
		{
			return BadRequest(new ResponseDto(404));
		}

		var filter = Builders<Post>.Filter.Eq(x => x.Id, id);
		var update = Builders<Post>.Update.Set(x => x.DisplayStatus, postStatusUpdateDto.DisplayStatus)
											  .Set(x => x.ModifiedAt, DateTime.UtcNow);

		var rs = await _postRepo.UpdateOneAsync(filter, update);

		return Ok(new ResponseDto(200, ResponseMessage.POST_UPDATE_STATUS_SUCCESS));
	}

	// [HttpDelete("{id}")]
	// public async Task<ActionResult<ResponseDto>> DeletePost()
	// {
	//     return Ok();
	// }

	// [HttpPut("")]
	// public async Task<ActionResult<ResponseDto>> UpdatePost()
	// {
	//     return Ok();
	// }

	[HttpPut("save/{id}")]
	public async Task<ActionResult<ResponseDto>> SavePost(string id)
	{
		var userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value;

		var rs = await _postLogic.SavePost(id, userId);

		if (rs == 0)
		{
			return BadRequest(new ResponseDto(400, ResponseMessage.POST_SAVE_FAIL));
		}
		else
		{
			return Ok(new ResponseDto(200, ResponseMessage.POST_SAVE_SUCCESS));
		}
	}
}
