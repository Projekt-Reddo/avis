using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly IHumSvcClient _humSvcClient;
    private readonly ISongRepo _songRepo;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public SearchController(
        IHumSvcClient humSvcClient,
        ISongRepo songRepo,
        IMapper mapper,
        IConfiguration configuration)
    {
        _humSvcClient = humSvcClient;
        _songRepo = songRepo;
        _mapper = mapper;
        _configuration = configuration;
    }

    [HttpPost("song/hum")]
    public async Task<ActionResult<ICollection<SongReadDto>>> SearchSongByHum([FromForm] IFormFile inputFile)
    {
        var songIds = await _humSvcClient.GetSongIdsByHum(file: inputFile);

        if (songIds is null)
        {
            return NotFound(new ResponseDto(400, ResponseMessage.SONG_NOT_FOUND));
        }
        var filter = Builders<Song>.Filter.In(x => x.Id, songIds);

        (_, var songs) = await _songRepo.FindManyAsync(filter: filter);

        return Ok(_mapper.Map<ICollection<SongReadDto>>(songs));
    }

    [HttpPost("song")]
    public async Task<ActionResult<ICollection<SongReadDto>>> SearchSongByText([FromQuery] string keyword)
    {
        var filter = new BsonDocument {
            { "index", _configuration["DbIndexs:Song"] },
            { "text", new BsonDocument {
                { "query", keyword },
                { "path", new BsonDocument {
                    { "wildcard", "*" }
                }},
            }}
        };

        (_, var songs) = await _songRepo.FindManyAsync(indexFilter: filter, limit: 10);

        return Ok(_mapper.Map<ICollection<SongReadDto>>(songs));
    }
}