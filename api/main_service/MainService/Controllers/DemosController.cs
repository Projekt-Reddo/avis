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
    [Obsolete]
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

        private readonly IMailService _mailService;

        public DemosController(IMongoContext context, IS3Service s3Service, IPostRepo postRepo, ICommentRepo commentRepo, IMapper mapper, IMailService mailService)
        {
            _database = context.Database;
            _songs = _database.GetCollection<Song>("Songs");
            _s3Service = s3Service;
            _mapper = mapper;
            _postRepo = postRepo;
            _commentRepo = commentRepo;
            _mailService = mailService;
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
            // var rs = await _s3Service.UploadFileAsync(S3Config.BUCKET_NAME, S3Config.SONGS_FOLDER, song.FileName, song.OpenReadStream(), song.ContentType);

            return Ok();
        }

        // [HttpGet("{id}")]
        // public async Task<ActionResult> Get(string id)
        // {
        //     var rs = await _s3Service.DownloadFileAsync(S3Config.BUCKET_NAME, null, "88703952_p0.png");

        //     return File(rs!, "image/png");
        // }

        [HttpGet("/getPosts")]
        public async Task<IActionResult> GetPosts()
        {

            BsonDocument lookup = new BsonDocument{
                { "from", "comment" },
                { "localField", "_id" },
                { "foreignField", "PostId" },
                { "as", "Comments" }
            };

            // Builders<Post>.Filter filter = Builders<Post>.Filter.Empty;

            BsonDocument sort = new BsonDocument{
                { "CreatedAt", -1 }
            };

            var result = await _postRepo.FindManyAsync(lookup: lookup, sort: sort);

            return Ok(result.entities);
        }

        [HttpPost("/addPost")]
        public async Task<ActionResult<PaginationResDto<PostReadDto>>> AddPost([FromBody] PaginationReqDto<PostCreateDto> paginationReqDto)
        {
            // var post = _mapper.Map<Post>(postDto);
            // var rs = await _postRepo.Add(post);

            return Ok("OK");
        }

        [HttpPost("/addComment")]
        public async Task<IActionResult> AddComment([FromBody] CommentCreateDto commentDto)
        {
            var comment = _mapper.Map<Comment>(commentDto);
            // var rs = await _commentRepo.Add(comment);

            return Ok("OK");
        }

        [HttpGet("/sendMail")]
        public async Task<IActionResult> SendMail()
        {

            await _mailService.SendEmailAsync(new MailRequest
            {
                ToEmail = "wsan.b214@gmail.com",
                Subject = "Hello Sekai",
                Body = _mailService.GetMailTemplate(MailTemplate.MAIL_VERIFY, "www.lapis.wiki")
            });

            return Ok();
        }
    }
}