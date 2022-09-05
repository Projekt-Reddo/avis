namespace MainService.Dtos;

public class ReportCreateDto
{
    public string UserId { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string PostId { get; set; } = null!;

    public string CommentId { get; set; } = null!;
}

public class ReportReadDto
{
    public string Id { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime ModifiedAt { get; set; }

    public AccountCreateDto User { get; set; } = null!;

    public string Content { get; set; } = null!;

    public PostReadDto? Post { get; set; } = null!;

    public CommentReadDto? Comment { get; set; } = null!;
}