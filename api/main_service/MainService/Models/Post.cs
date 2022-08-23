using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

/// <summary>
/// Post model storing all information about a post
/// </summary>
public class Post : BaseModel
{
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    public User? User { get; set; } = null!; // Post user

    public string Content { get; set; } = null!;

    public ICollection<Media> Medias { get; set; } = null!;

    public DateTime PublishedAt { get; set; }

    public string DisplayStatus { get; set; } = null!;

    public ICollection<ObjectId> UpvotedBy { get; set; } = null!;

    public ICollection<ObjectId> DownvotedBy { get; set; } = null!;

    public ICollection<string> Hashtags { get; set; } = null!;

    public ICollection<string> HashtagsNormalized { get; set; } = null!;

    public ICollection<ObjectId>? Comments { get; set; } = null!; // This post's comments id
}