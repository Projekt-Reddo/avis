using AutoMapper;
// using Hangfire;
using MainService.Data;
using MainService.Dtos;
using MainService.Logic;
using MainService.Models;
using MainService.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController : ControllerBase
{
    private readonly ISongRepo _songRepo;
    private readonly IMapper _mapper;
    private readonly IS3Service _s3Service;
    private readonly IConfiguration _configuration;
    private readonly ISongLogic _songLogic;

    public SongsController(
        ISongRepo songRepo,
        IMapper mapper,
        IS3Service s3Service,
        IConfiguration configuration,
        ISongLogic songLogic
    )
    {
        _songRepo = songRepo;
        _mapper = mapper;
        _s3Service = s3Service;
        _configuration = configuration;
        _songLogic = songLogic;
    }

    [HttpPost]
    public async Task<ActionResult<ResponseDto>> CreateSong([FromForm] SongCreateDto songCreateDto)
    {
        var song = _mapper.Map<Song>(songCreateDto);
        await _songRepo.AddOneAsync(song);

        (var songUploadStatus, var songUrl) = await _s3Service.UploadFileAsync(
                _configuration.GetValue<string>("S3:SongsBucket"),
                S3Config.SONGS_FOLDER,
                song.Id,
                songCreateDto.File.OpenReadStream(),
                songCreateDto.File.ContentType,
                null!
            );

        song.Url = new Url();
        song.Url.Internal = songUrl;

        if (songCreateDto.Thumbnail.Length > 0)
        {
            (var thumbnailUploadStatus, var thumbnailUrl) = await _s3Service.UploadFileAsync(
                _configuration.GetValue<string>("S3:ResourcesBucket"),
                S3Config.IMAGES_FOLDER,
                song.Id,
                songCreateDto.Thumbnail.OpenReadStream(),
                songCreateDto.Thumbnail.ContentType,
                null!
            );

            song.Thumbnail = thumbnailUrl;
        }
        else
        {
            song.Thumbnail = "default";
        }

        await _songRepo.UpdateOneAsync(song.Id, song);

        return Ok(new ResponseDto(200, "Song created"));
    }


    /// <summary>
    /// Get all songs in database with filter and pagination
    /// </summary>
    /// <param name="pagination">Pagination metrics and Search filters</param>
    /// <returns>200 / 400 / 404</returns>
    [HttpPost("filter")]
    public async Task<ActionResult<PaginationResDto<IEnumerable<SongManageListDto>>>> ViewSong(PaginationReqDto<SongFilterDto> pagination)
    {
        // Create Song Filter
        var songFilter = _songLogic.SongFilter(pagination);

        // Pagination formula
        var skipPage = (pagination.Page - 1) * pagination.Size;

        // Config to get Song's Artists
        BsonDocument lookup = new BsonDocument{
                { "from", "artist" },
                { "localField", "ArtistIds" },
                { "foreignField", "_id" },
                { "as", "Artists" }
            };

        // Config to specify needed fields
        BsonDocument project = new BsonDocument{
                { "_id", 1 },
                { "CreatedAt", 1 },
                { "ModifiedAt", 1 },
                { "Title", 1 },
                { "Thumbnail", 1 },
                { "Artists",  new BsonDocument{
                    {"_id" , 1},
                    {"Name" , 1}
                } },
            };

        // Get songs in database with filter and pagination
        (var totalSong, var songsFromRepo) = await _songRepo.FindManyAsync(filter: songFilter, lookup: lookup, project: project, limit: pagination.Size, skip: skipPage);

        var songs = _mapper.Map<IEnumerable<SongManageListDto>>(songsFromRepo);

        return Ok(new PaginationResDto<SongManageListDto>((Int32)totalSong, songs));
    }
}
