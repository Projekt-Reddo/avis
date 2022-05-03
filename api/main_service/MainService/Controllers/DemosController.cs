using MainService.Data;
using MainService.Models;
using MainService.Services;
using Microsoft.AspNetCore.Mvc;
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

        public DemosController(IMongoContext context, IS3Service s3Service)
        {
            _database = context.Database;
            _songs = _database.GetCollection<Song>("Songs");
            _s3Service = s3Service;
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
    }
}