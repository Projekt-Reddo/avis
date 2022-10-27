using MainService.Dtos;
using MainService.Logic;
using MainService.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Constants;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
	private readonly IReportLogic _reportLogic;

	public ReportsController(IReportLogic reportLogic)
	{
		_reportLogic = reportLogic;
	}

	[Authorize]
	[HttpPost]
	public async Task<ActionResult<ResponseDto>> ReportPost(ReportCreateDto reportDto)
	{
		ReportLogicResponse rs = new ReportLogicResponse();
		var userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value; // Get user id from token
		reportDto.UserId = userId;

		if (String.IsNullOrWhiteSpace(reportDto.PostId) && String.IsNullOrWhiteSpace(reportDto.CommentId))
		{
			return BadRequest(new ResponseDto(400, ResponseMessage.REPORT_NO_IDS));
		}

		if (!String.IsNullOrWhiteSpace(reportDto.PostId))
		{
			rs = await _reportLogic.PostReport(reportDto);
		}

		if (!String.IsNullOrWhiteSpace(reportDto.CommentId))
		{
			rs = await _reportLogic.CommentReport(reportDto);
		}

		return StatusCode(rs.StatusCode, new ResponseDto(rs.StatusCode, rs.Message));
	}

	[HttpPost("filter")]
	public async Task<ActionResult<PaginationResDto<ReportReadDto>>> GetReports(PaginationReqDto<ReportFilterDto> pagination)
	{
		return Ok(await _reportLogic.List(pagination));
	}
}
