using MainService.Dtos;
using MainService.Logic;
using MainService.Utils;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController : ControllerBase
{
    private readonly IGenreLogic _genreLogic;

    public GenresController(IGenreLogic genreLogic)
    {
        _genreLogic = genreLogic;
    }

    [HttpPost]
    public async Task<ActionResult<ResponseDto>> CreateManyGenre(GenreManyCreateDto genreManyCreateDto)
    {
        var rs = await _genreLogic.CreateManyGenre(genreManyCreateDto);
        if (rs == 0)
        {
            return BadRequest(new ResponseDto(400, ResponseMessage.GENRE_CREATE_FAIL));
        }
        if (rs <= genreManyCreateDto.Names.Count)
        {
            return BadRequest(new ResponseDto(200, ResponseMessage.GENRE_CREATE_SUCESS_AND_FAIL));
        }
        return Ok(new ResponseDto(200, ResponseMessage.GENRE_CREATE_SUCCESS));
    }

    [HttpGet]
    public async Task<ActionResult<ICollection<GenreReadDto>>> GetAllGenre()
    {
        return Ok(await _genreLogic.GetAllGenre());
    }

    [HttpPost("recommend")]
    public async Task<ActionResult<ICollection<GenreReadDto>>> RecommendGenres(GenreRecommendDto genreRecommendDto)
    {
        var rs = await _genreLogic.GetGenresByName(genreRecommendDto.Keyword);
        return Ok(rs);
    }

    [HttpDelete]
    public async Task<ActionResult<ResponseDto>> DeleteManyGenre(GenreManyDeleteDto genreManyDeleteDto)
    {
        var rs = await _genreLogic.DeleteManyGenre(genreManyDeleteDto);
        if (rs == 0)
        {
            return BadRequest(new ResponseDto(400, ResponseMessage.GENRE_DELETE_FAIL));
        }
        if (rs <= genreManyDeleteDto.Ids.Count)
        {
            return BadRequest(new ResponseDto(200, ResponseMessage.GENRE_DELETE_SUCCESS_AND_FAIL));
        }
        return Ok(new ResponseDto(200, ResponseMessage.GENRE_DELETE_SUCCESS));
    }
}
