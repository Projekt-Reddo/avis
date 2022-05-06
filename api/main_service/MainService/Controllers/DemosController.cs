using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemosController : ControllerBase
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<Song> _songs;
        private readonly IS3Service _s3Service;

        private readonly IMapper _mapper;
        private readonly IPostRepo _postRepo;
        private readonly ICommentRepo _commentRepo;

        public DemosController(IMongoContext context, IS3Service s3Service, IPostRepo postRepo, ICommentRepo commentRepo, IMapper mapper)
        {
            _database = context.Database;
            _songs = _database.GetCollection<Song>("Songs");
            _s3Service = s3Service;
            _mapper = mapper;
            _postRepo = postRepo;
            _commentRepo = commentRepo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var songs = await _songs.FindAsync(s => true);
            return Ok(await songs.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Post(IFormFile song)
        {
            var rs = await _s3Service.UploadFileAsync(S3Config.BUCKET_NAME, S3Config.SONGS_FOLDER, song.FileName, song.OpenReadStream(), song.ContentType);

            return Ok(rs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(string id)
        {
            var rs = await _s3Service.DownloadFileAsync(S3Config.BUCKET_NAME, null, "88703952_p0.png");

            return File(rs!, "image/png");
        }

        [HttpGet("/getPosts")]
        public async Task<IActionResult> GetPosts()
        {

            BsonDocument lookup = new BsonDocument
            {
                {
                "$lookup", new BsonDocument{
                        { "from", "comment" },
                        { "localField", "_id" },
                        { "foreignField", "PostId" },
                        { "as", "Comments" }
                    }
                }
            };

            var posts = await _postRepo.GetAll(lookup: lookup);

            return Ok(posts);
        }

        [HttpPost("/addPost")]
        public async Task<IActionResult> AddPost([FromBody] PostDto postDto)
        {
            var post = _mapper.Map<Post>(postDto);
            var rs = await _postRepo.Add(post);

            return Ok("OK");
        }

        [HttpPost("/addComment")]
        public async Task<IActionResult> AddComment([FromBody] CommentDto commentDto)
        {
            var comment = _mapper.Map<Comment>(commentDto);
            var rs = await _commentRepo.Add(comment);

            return Ok("OK");
        }

    }
}