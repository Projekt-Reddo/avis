using MainService.Dtos;
using Microsoft.AspNetCore.SignalR;
using static Constants;

namespace MainService.Hubs;

public class NotifyHub : Hub
{
	private readonly ILogger<NotifyHub> _logger;

	public NotifyHub(ILogger<NotifyHub> logger)
	{
		_logger = logger;
	}

	public override async Task OnConnectedAsync()
	{
		try
		{
			var userId = Context.User!.FindFirst(JwtTokenPayload.USER_ID)!.Value;
			// _logger.LogInformation($"Token: {userId}");

			await Groups.AddToGroupAsync(Context.ConnectionId, userId);
		}
		catch (Exception)
		{
		}

		await base.OnConnectedAsync();
	}

	public override async Task OnDisconnectedAsync(Exception? exception)
	{

		try
		{
			var userId = Context.User!.FindFirst(JwtTokenPayload.USER_ID)!.Value;
			// _logger.LogInformation($"Token: {userId}");

			await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
		}
		catch (Exception)
		{
		}

		await base.OnConnectedAsync();
	}
}