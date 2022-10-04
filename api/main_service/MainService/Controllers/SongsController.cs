using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Logic;
using MainService.Models;
using MainService.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MainService.Utils;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;

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
    private readonly ILogger<SongsController> _logger;

    public SongsController(
        ISongRepo songRepo,
        IMapper mapper,
        IS3Service s3Service,
        IConfiguration configuration,
        ISongLogic songLogic,
        ILogger<SongsController> logger
    )
    {
        _songRepo = songRepo;
        _mapper = mapper;
        _s3Service = s3Service;
        _configuration = configuration;
        _songLogic = songLogic;
        _logger = logger;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ResponseDto>> CreateSong([FromForm] SongCreateDto songCreateDto)
    {
        (var isMp3File, var songCheckMessage) = FileExtension.CheckMp3Extension(songCreateDto.File);
        if (isMp3File is false)
        {
            return BadRequest(new ResponseDto(400, $"Song file: {songCheckMessage}"));
        }

        (var isImageFile, var imageCheckMessage) = FileExtension.CheckImageExtension(songCreateDto.Thumbnail);
        if (isImageFile is false)
        {
            return BadRequest(new ResponseDto(400, $"Thumbnail: {imageCheckMessage}"));
        }

        var song = _mapper.Map<Song>(songCreateDto);
        bool songUploadStatus = false;

        using var session = await _songRepo.StartSessionAsync();
        try
        {
            session.StartTransaction();
            await _songRepo.AddOneAsync(song);

            songUploadStatus = await _songLogic.UploadNewSong(
                song,
                songCreateDto.File.OpenReadStream(),
                songCreateDto.File.ContentType,
                FileExtension.GetFileExtension(songCreateDto.File));
            await _songLogic.UploadNewThumbnail(
                song,
                songCreateDto.Thumbnail.OpenReadStream(),
                songCreateDto.Thumbnail.ContentType,
                FileExtension.GetFileExtension(songCreateDto.Thumbnail));
            await session.CommitTransactionAsync();
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            await session.AbortTransactionAsync();
            return BadRequest(new ResponseDto(400, ResponseMessage.SONG_CREATE_FAIL));
        }

        if (songUploadStatus is false)
        {
            return BadRequest(new ResponseDto(400, ResponseMessage.UPLOAD_SONG_FILE_FAIL));
        }

        return Ok(new ResponseDto(200, ResponseMessage.UPLOAD_SONG_SUCCESS));
    }

    /// <summary>
    /// Get all songs in database with filter and pagination
    /// </summary>
    /// <param name="pagination">Pagination metrics and Search filters</param>
    /// <returns>200 / 400 / 404</returns>
    [Authorize]
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

        // Config to sort created date decrease
        BsonDocument sort = new BsonDocument{
                { "CreatedAt", -1 }
            };

        // Get songs in database with filter and pagination
        (var totalSong, var songsFromRepo) = await _songRepo.FindManyAsync(
            filter: songFilter,
            lookup: lookup, project:
            project, sort: sort,
            limit: pagination.Size,
            skip: skipPage);

        var songs = _mapper.Map<IEnumerable<SongManageListDto>>(songsFromRepo);

        return Ok(new PaginationResDto<SongManageListDto>((Int32)totalSong, songs));
    }

    /// <summary>
    /// Delete songs with list id
    /// </summary>
    /// <param name="songDeleteDto"></param>
    /// <returns>200 / 404</returns>
    [Authorize]
    [HttpDelete]
    public async Task<ActionResult<ResponseDto>> DeleteSong(SongDeleteDto songDeleteDto)
    {
        var songUpdate = Builders<Song>.Update.Set(s => s.IsDeleted, true);

        var rs = await _songRepo.SoftDelete(songDeleteDto.listId, songUpdate);

        if (rs == false)
        {
            return BadRequest(new ResponseDto(404, ResponseMessage.SONG_DELETE_FAIL));
        }

        return Ok(new ResponseDto(200, ResponseMessage.SONG_DELETE_SUCCESS));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SongReadDto>> GetSong(string id)
    {
        var song = await _songLogic.GetSongById(id);

        if (song is null)
        {
            return NotFound(new ResponseDto(404));
        }

        return Ok(_mapper.Map<SongReadDto>(song));
    }

    [HttpPost("related")]
    public async Task<ActionResult> GetRelatedSongs(RelatedSongFilter songFilter)
    {
        var songs = await _songLogic.GetSongByGenres(songFilter.Genres);

        return Ok(_mapper.Map<ICollection<SongReadDto>>(songs));
    }
}
