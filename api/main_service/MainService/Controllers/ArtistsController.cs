using MainService.Dtos;
using MainService.Logic;
using MainService.Utils;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
    private readonly IArtistLogic _artistLogic;

    public ArtistsController(IArtistLogic artistLogic)
    {
        _artistLogic = artistLogic;
    }

    [HttpPost]
    public async Task<ActionResult<ResponseDto>> CreateManyGenre([FromForm] ArtistManyCreateDto manyCreateDto)
    {
        var rs = await _artistLogic.CreateMany(manyCreateDto.Artists);
        if (rs == 0)
        {
            return BadRequest(new ResponseDto(400, ResponseMessage.ARTIST_CREATE_FAIL));
        }
        if (rs < manyCreateDto.Artists.Count)
        {
            return BadRequest(new ResponseDto(200, ResponseMessage.ARTIST_CREATE_SUCESS_AND_FAIL));
        }
        return Ok(new ResponseDto(200, ResponseMessage.ARTIST_CREATE_SUCCESS));
    }

    [HttpGet]
    public async Task<ActionResult<ICollection<GenreReadDto>>> GetAllGenre()
    {
        return Ok(await _artistLogic.GetAllGenre());
    }

    [HttpPost("recommend")]
    public async Task<ActionResult<ICollection<GenreReadDto>>> RecommendGenres(GenreRecommendDto genreRecommendDto)
    {
        var rs = await _artistLogic.GetByName(genreRecommendDto.Keyword);
        return Ok(rs);
    }

    [HttpDelete]
    public async Task<ActionResult<ResponseDto>> DeleteManyGenre(ArtistManyDeleteDto manyDeleteDto)
    {
        var rs = await _artistLogic.DeleteMany(manyDeleteDto);
        if (rs == 0)
        {
            return BadRequest(new ResponseDto(400, ResponseMessage.ARTIST_DELETE_FAIL));
        }
        if (rs < manyDeleteDto.Ids.Count)
        {
            return BadRequest(new ResponseDto(200, ResponseMessage.ARTIST_DELETE_SUCCESS_AND_FAIL));
        }
        return Ok(new ResponseDto(200, ResponseMessage.ARTIST_DELETE_SUCCESS));
    }
}
