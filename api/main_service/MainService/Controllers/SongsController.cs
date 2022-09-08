using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Logic;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using Microsoft.AspNetCore.Mvc;

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
        await _songRepo.AddOneAsync(song);

        var songUploadStatus = await _songLogic.UploadNewSong(song, songCreateDto.File.OpenReadStream(), songCreateDto.File.ContentType);
        await _songLogic.UploadNewThumbnail(song, songCreateDto.Thumbnail.OpenReadStream(), songCreateDto.Thumbnail.ContentType);
        if (songUploadStatus is false)
        {
            return BadRequest(new ResponseDto(400, ResponseMessage.UPLOAD_SONG_FILE_FAIL));
        }

        return Ok(new ResponseDto(200, ResponseMessage.UPLOAD_SONG_SUCCESS));
    }
}
