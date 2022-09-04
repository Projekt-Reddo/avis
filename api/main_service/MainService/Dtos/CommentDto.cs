namespace MainService.Dtos;

public class CommentCreateDto
{
    public string UserId { get; set; } = null!;

    public string Content { get; set; } = null!;

    public IFormFile Media { get; set; } = null!;
}

public class CommentReadDto
{
    public string Id { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime ModifiedAt { get; set; }

    public string Content { get; set; } = null!;

    public int Upvote { get; set; } = 0;

    public int Downvote { get; set; } = 0;

    public MediaReadDto Media { get; set; } = null!;

    public AccountReadDto? User { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}

public class CommentUpdateDto
{
    public string? Content { get; set; } = null!;

    public IFormFile Media { get; set; } = null!;
}

public class CommentUpdateVoteDto
{
    public string? UpvoteBy { get; set; } = null!;

    public string? DownvoteBy { get; set; } = null!;
}