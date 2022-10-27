using MainService.Dtos;
using MainService.Logic;
using MainService.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Constants;

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

	[Authorize(Roles = $"{AccountRoles.ADMIN},{AccountRoles.MODERATOR}")]
	[HttpPost]
    public async Task<ActionResult<ResponseDto>> CreateMany(ArtistManyCreateDto manyCreateDto)
    {
        var msg = await _artistLogic.CreateMany(manyCreateDto.Artists);
        if (!String.IsNullOrEmpty(msg))
        {
            return Ok(new ResponseDto
            {
                Status = 200,
                Message = msg
            });
        }

        return Ok(new ResponseDto
        {
            Status = 200,
            Message = ResponseMessage.ARTIST_CREATE_SUCCESS
        });
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<ICollection<ArtistReadDto>>> GetAll()
    {
        var rs = await _artistLogic.GetAll();
        return Ok(rs);
    }

	[Authorize(Roles = $"{AccountRoles.ADMIN},{AccountRoles.MODERATOR}")]
	[HttpPost("filter")]
	public async Task<ActionResult<ICollection<ArtistReadDto>>> GetAll(PaginationReqDto<ArtistFilterDto> pagination)
	{
		var rs = await _artistLogic.List(pagination);
		return Ok(rs);
	}

	[Authorize]
    [HttpPost("recommend")]
    public async Task<ActionResult<ICollection<ArtistReadDto>>> Recommend(ArtistRecommendDto recommendDto)
    {
        var rs = await _artistLogic.GetByName(recommendDto.Keyword);
        return Ok(rs);
    }

	[Authorize(Roles = $"{AccountRoles.ADMIN},{AccountRoles.MODERATOR}")]
	[HttpDelete]
    public async Task<ActionResult<ResponseDto>> DeleteMany(ArtistManyDeleteDto manyDeleteDto)
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
