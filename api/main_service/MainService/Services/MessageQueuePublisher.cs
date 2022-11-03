using RabbitMQ.Client;

namespace MainService.Services;

public interface IMessageQueuePublisher { }

public class MessageQueuePublisher : IMessageQueuePublisher
{
	private readonly ILogger<MessageQueuePublisher> _logger;
	private readonly IConnection _connection = null!;
	private readonly IModel _channel = null!;

	public MessageQueuePublisher(IConfiguration configuration, ILogger<MessageQueuePublisher> logger)
	{
		_logger = logger;

		// Connection config object
		var factory = new ConnectionFactory()
		{
			Uri = new Uri(Environment.GetEnvironmentVariable("RABBITMQ_URI") ?? configuration.GetValue<string>("RabbitMq:Uri"))
		};
		// Create connection
		try
		{
			_connection = factory.CreateConnection();
			_channel = _connection.CreateModel();
			_channel.ExchangeDeclare(exchange: "trigger", type: ExchangeType.Fanout);
			_logger.LogInformation("Connected to RabbitMQ");
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Failed to create connection to RabbitMQ");
		}
	}

	public void Dispose()
	{
		if (_channel.IsOpen)
		{
			_channel.Close();
			_connection.Close();
		}
	}
}
