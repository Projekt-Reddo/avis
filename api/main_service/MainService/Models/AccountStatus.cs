namespace MainService.Models;

public class AccountStatus : BaseModel
{
    public bool IsBanned { get; set; } = false;

    public DateTime PostMutedUntil { get; set; }

    public DateTime CommentMutedUntil { get; set; }
}