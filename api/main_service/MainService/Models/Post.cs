using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

/// <summary>
/// Post model storing all information about a post
/// </summary>
[BsonIgnoreExtraElements]
public class Post : BaseModel
{
    public string UserId { get; set; } = null!;

    [BsonIgnoreIfNull]
    public Account? User { get; set; } = null!; // Post user

    public string Content { get; set; } = null!;

    public ICollection<Media> Medias { get; set; } = null!;

    public DateTime PublishedAt { get; set; }

    public string DisplayStatus { get; set; } = null!;

    public ICollection<string> UpvotedBy { get; set; } = null!;

    public ICollection<string> DownvotedBy { get; set; } = null!;

    public ICollection<string> Hashtags { get; set; } = null!;

    public ICollection<string> HashtagsNormalized { get; set; } = null!;

    public ICollection<ObjectId>? CommentIds { get; set; } = null!; // This post's comments id

    [BsonIgnoreIfNull]
    public ICollection<Comment> Comments { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}