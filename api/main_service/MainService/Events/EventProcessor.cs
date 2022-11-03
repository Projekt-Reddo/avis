using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using MainService.Dtos;

namespace MainService.Events;

public interface IEventProcessor
{
	Task ProcessEvent(string message);
}

public class EventProcessor : IEventProcessor
{
	private readonly ILogger<EventProcessor> _logger;
	private readonly IServiceScopeFactory _serviceScopeFactory;

	public EventProcessor(ILogger<EventProcessor> logger, IServiceScopeFactory serviceScopeFactory)
	{
		_logger = logger;
		_serviceScopeFactory = serviceScopeFactory;
	}

	public async Task ProcessEvent(string message)
	{
		var eventType = JsonSerializer.Deserialize<EventDto>(message);

		switch (eventType!.Event)
		{
			case EventType.REPORT_ACCEPTED:
				// method to handle event
				break;

			default:
				await Task.CompletedTask;
				break;
		}
	}
}

public static class EventType
{
	public const string REPORT_ACCEPTED = "report_accepted";
}
