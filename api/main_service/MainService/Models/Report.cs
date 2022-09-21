using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

/// <summary>
/// PortReport model storing all information about a report for a post
/// </summary>
[BsonIgnoreExtraElements]
public class Report : BaseModel
{

    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    public Account? User { get; set; } = null!;

    public string Content { get; set; } = null!;

    public Post? Post { get; set; }

    public Comment? Comment { get; set; }
}