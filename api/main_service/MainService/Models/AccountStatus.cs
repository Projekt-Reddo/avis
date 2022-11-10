using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

public class AccountStatus
{
    public bool IsBanned { get; set; } = false;

    public DateTime? PostMutedUntil { get; set; }

    public DateTime? CommentMutedUntil { get; set; }
}
