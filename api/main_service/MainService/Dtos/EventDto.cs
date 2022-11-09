namespace MainService.Dtos;

public class EventDto
{
	public string ReceiverId { get; set; } = null!;

	public string Message { get; set; } = null!;

	public DateTime CreatedAt { get; set; } = DateTime.Now;

	public bool IsRead { get; set; } = false;

	public string Event { get; set; } = null!;

}