using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

/// <summary>
/// Comment model for storing all information about a comment
/// </summary>
[BsonIgnoreExtraElements]
public class Comment : BaseModel
{
    // [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]

    public string UserId { get; set; } = null!;

    [BsonIgnoreIfNull]
    public Account? User { get; set; } = null!; // Comment user

    public string Content { get; set; } = null!;

    public ICollection<string> UpvotedBy { get; set; } = null!;

    public ICollection<string> DownvotedBy { get; set; } = null!;

    public ICollection<ObjectId> Comments { get; set; } = null!;

    public Media Media { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}