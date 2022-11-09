using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

[BsonIgnoreExtraElements]
public class Notify : IdAttrModel
{
	public string ReceiverId { get; set; } = null!;

	public string Message { get; set; } = null!;

	public DateTime CreatedAt { get; set; } = DateTime.Now;

	public bool IsRead { get; set; }
}