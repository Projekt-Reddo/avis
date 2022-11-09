using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Hubs;
using MainService.Models;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Events;

public interface IEventProcessor
{
	Task ProcessEvent(string message);
}

public class EventProcessor : IEventProcessor
{
	private readonly IMapper _mapper;
	private readonly ILogger<EventProcessor> _logger;
	private readonly IServiceScopeFactory _serviceScopeFactory;
	private readonly IHubContext<NotifyHub> _notifyHub;

	public EventProcessor(
		IMapper mapper,
		ILogger<EventProcessor> logger,
		IServiceScopeFactory serviceScopeFactory,
		IHubContext<NotifyHub> notifyHub
	)
	{
		_mapper = mapper;
		_logger = logger;
		_serviceScopeFactory = serviceScopeFactory;
		_notifyHub = notifyHub;
	}

	public async Task ProcessEvent(string message)
	{
		var eventType = JsonSerializer.Deserialize<EventDto>(message);

		switch (eventType!.Event)
		{
			case EventType.REPORT_ACCEPTED:
				await ProcessSendNotifi(eventType);
				break;
			case EventType.REPORT_DENIED:
				await ProcessSendNotifi(eventType);
				break;
			case EventType.POST_DELETED:
				await ProcessSendNotifi(eventType);
				break;
			default:
				await Task.CompletedTask;
				break;
		}
	}

	private async Task ProcessSendNotifi(EventDto message)
	{
		using (var scope = _serviceScopeFactory.CreateScope())
		{
			var mongoContext = scope.ServiceProvider.GetRequiredService<IMongoContext>();
			var notify = mongoContext.Database.GetCollection<Notify>("notify");

			var notification = _mapper.Map<Notify>(message);

			try
			{
				await notify.InsertOneAsync(notification);
				_logger.LogInformation($"Added new notification");

			}
			catch (Exception ex)
			{
				_logger.LogError(ex, $"Failed to add new notification");
			}

			await _notifyHub.Clients.Group(message.ReceiverId).SendAsync(HubReturnMethod.RECEIVENOTIFICATION, notification);
		}
	}
}
