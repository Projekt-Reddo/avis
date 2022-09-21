using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

[BsonIgnoreExtraElements]
public class AccountStatus : BaseModel
{
    public bool IsBanned { get; set; } = false;

    public DateTime PostMutedUntil { get; set; }

    public DateTime CommentMutedUntil { get; set; }
}