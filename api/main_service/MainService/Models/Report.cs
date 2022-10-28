using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

/// <summary>
/// PortReport model storing all information about a report for a post
/// </summary>
[BsonIgnoreExtraElements]
public class Report : BaseModel
{
	public string UserId { get; set; } = null!;

	[BsonIgnoreIfNull]
	public Account? User { get; set; } = null!;

	public string Content { get; set; } = null!;

	public string Type { get; set; } = null!;

	[BsonIgnoreIfNull]
	public Post? Post { get; set; }

	[BsonIgnoreIfNull]
	public Comment? Comment { get; set; }

	public string Status { get; set; } = null!;

	// Confirm admin id
	public string ConfirmedId { get; set; } = null!;

	[BsonIgnoreIfNull]
	public Account? ConfirmedBy { get; set; } = null!;
}