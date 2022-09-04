using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HumController : ControllerBase
{
    private readonly IHumSvcClient _humSvcClient;
    private readonly ISongRepo _songRepo;

    public HumController(IHumSvcClient humSvcClient, ISongRepo songRepo)
    {
        _humSvcClient = humSvcClient;
        _songRepo = songRepo;
    }

    [HttpPost]
    public async Task<ActionResult<ResponseDto>> GetSongsByHum([FromForm] IFormFile inputFile)
    {
        var songIds = await _humSvcClient.GetSongIdsByHum(file: inputFile);

        if (songIds is null)
        {
            return NotFound(new ResponseDto(400, ResponseMessage.SONG_NOT_FOUND));
        }

        var filter = Builders<Song>.Filter.In(x => x.Id, songIds);

        var songs = await _songRepo.FindManyAsync(filter: filter);

        return Ok(songs);
    }
}