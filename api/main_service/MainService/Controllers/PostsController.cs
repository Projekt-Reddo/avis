using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Logic;
using MainService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IPostRepo _postRepo;
    private readonly IConfiguration _configuration;
    private readonly IPostLogic _postLogic;

    public PostsController(
        IMapper mapper,
        IPostRepo postRepo,
        IConfiguration configuration,
        IPostLogic postLogic
    )
    {
        _mapper = mapper;
        _postRepo = postRepo;
        _configuration = configuration;
        _postLogic = postLogic;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ResponseDto>> AddPost([FromBody] PostCreateDto newPost)
    {
        var post = _mapper.Map<Post>(newPost);
        var rs = await _postRepo.AddOneAsync(post);
        return Ok(new ResponseDto(200, "Add new post successfully"));
    }

    /// <summary>
    /// Get all post in database with filter and pagination
    /// </summary>
    /// <param name="pagination">Pagination metrics and Search filters</param>
    /// <returns>200 / 400 / 404</returns>
    [HttpPost("filter")]
    public async Task<ActionResult<PaginationResDto<IEnumerable<PostReadDto>>>> ViewPost(PaginationReqDto<PostFilterDto> pagination)
    {
        // Create Post Filter
        var postFilter = Builders<Post>.Filter.Empty;

        // Hashtags Filter
        if (pagination.Filter.Hashtags != null)
        {
            postFilter = postFilter & Builders<Post>.Filter.All(x => x.Hashtags, pagination.Filter.Hashtags);
        }

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
                { "CreatedAt", -1 }
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

            (var totalPostFTS, var postsFromRepoFTS) = await _postRepo.FindManyAsync(
                indexFilter: searchfilter,
                filter: postFilter,
                lookup: lookup,
                project: project,
                sort: sort,
                limit: pagination.Size,
                skip: skipPage);

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

        // Created At Filter
        postFilter = postFilter & Builders<Post>.Filter.Gte(x => x.CreatedAt, DateTime.Now.AddDays(-1));
        postFilter = postFilter & Builders<Post>.Filter.Lte(x => x.CreatedAt, DateTime.Now);

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

    // [HttpPut("vote/{id}")]
    // public async Task<ActionResult<ResponseDto>> UpDownVotePost()
    // {
    //     return Ok();
    // }
}
