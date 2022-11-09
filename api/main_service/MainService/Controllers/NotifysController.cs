using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Hubs;
using MainService.Models;
using MainService.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotifysController : ControllerBase
{
	private readonly IMapper _mapper;
	private readonly INotifyRepo _notifyRepo;
	private readonly IAccountRepo _accountRepo;
	private readonly IHubContext<NotifyHub> _notifyHub;

	public NotifysController(
		IMapper mapper,
		INotifyRepo notifyRepo,
		IAccountRepo accountRepo,
		IHubContext<NotifyHub> notifyHub
	)
	{
		_mapper = mapper;
		_notifyRepo = notifyRepo;
		_accountRepo = accountRepo;
		_notifyHub = notifyHub;
	}

	/// <summary>
	/// Get all post in database with filter and pagination
	/// </summary>
	/// <param name="pagination">Pagination metrics and Search filters</param>
	/// <returns>200 / 400 / 404</returns>
	[HttpPost("filter")]
	public async Task<ActionResult<PaginationResDto<IEnumerable<Notify>>>> ViewUserNotify(PaginationReqDto<UserNotifyFilterDto> pagination)
	{
		var userId = "";

		// Get User Id
		try
		{
			userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value;
		}
		catch (Exception)
		{
			userId = null;
		}

		// Private Notify Filter
		if (userId is null)
		{
			return BadRequest(new ResponseDto(400, ResponseMessage.ACCOUNT_UNAUTHENTICATED));
		}

		// Create Notify Filter
		var notifyFilter = Builders<Notify>.Filter.Empty;

		notifyFilter = notifyFilter & Builders<Notify>.Filter.Eq(x => x.ReceiverId, userId);

		(var totalNotify, var notifysFromRepo) = await _notifyRepo.FindManyAsync(
			filter: notifyFilter,
			limit: pagination.Size,
			skip: (pagination.Page - 1) * pagination.Size); // Pagination formula

		var notifys = _mapper.Map<IEnumerable<Notify>>(notifysFromRepo);

		return Ok(new PaginationResDto<Notify>((Int32)totalNotify, notifys));
	}

	[HttpPut("isRead")]
	public async Task<ActionResult<ResponseDto>> SetIsRead()
	{
		var userId = "";

		// Get User Id
		try
		{
			userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value;
		}
		catch (Exception)
		{
			userId = null;
		}

		// Private Notify Filter
		if (userId is null)
		{
			return BadRequest(new ResponseDto(400, ResponseMessage.ACCOUNT_UNAUTHENTICATED));
		}

		// Get Notifications are not read
		var notifyFilter = Builders<Notify>.Filter.Eq(x => x.ReceiverId, userId) & Builders<Notify>.Filter.Eq(x => x.IsRead, false);
		(var totalNotify, var notifysFromRepo) = await _notifyRepo.FindManyAsync(filter: notifyFilter);

		if (totalNotify == 0)
		{
			return Ok(new ResponseDto(200, ResponseMessage.NOTIFY_IS_READ_SUCCESS));
		}

		// Update Notifications to is read
		var successCount = 0;

		foreach (var report in notifysFromRepo)
		{
			var filter = Builders<Notify>.Filter.Eq(x => x.Id, report.Id) & Builders<Notify>.Filter.Eq(x => x.IsRead, false);
			var update = Builders<Notify>.Update.Set(x => x.IsRead, true);

			var rs = await _notifyRepo.UpdateOneAsync(filter, update);
			successCount += 1;
		}

		return Ok(new ResponseDto(200, ResponseMessage.NOTIFY_IS_READ_SUCCESS));
	}
}