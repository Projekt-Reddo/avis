namespace MainService.Dtos;

public class PostCreateDto
{
    public string Content { get; set; } = null!;

    public ICollection<IFormFile> Medias { get; set; } = null!;

    public List<string>? HashTags { get; set; } = null!;

    public DateTime PublishedAt { get; set; }

    public string UserId { get; set; } = null!;
}

public class PostReadDto
{
    public string Id { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime ModifiedAt { get; set; }

    public string Content { get; set; } = null!;

    public ICollection<MediaReadDto> Medias { get; set; } = null!;

    public int Upvote { get; set; } = 0;

    public int Downvote { get; set; } = 0;

    public List<string> Tags { get; set; } = null!;

    public AccountReadDto? User { get; set; } = null!;

    public IEnumerable<CommentReadDto>? Comments { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}

public class PostUpdateDto
{
    public string? Content { get; set; } = null!;
}

public class PostReportDto
{
    public long ReportPost { get; set; }

    public long ReportedPost { get; set; }
}

public class ListPostDto
{
    public string Id { get; set; } = null!;

    public AccountReadDto? User { get; set; } = null!;

    public string Content { get; set; } = null!;

    public ICollection<MediaReadDto> Medias { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime ModifiedAt { get; set; }

    public DateTime PublishedAt { get; set; }

    public int UpvotedBy { get; set; } = 0;

    public int DownvotedBy { get; set; } = 0;

    public List<string> HashTags { get; set; } = null!;

    public int CommentCount { get; set; }
}

public class VotePostDto
{
    public string PostId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public bool UpVote { get; set; }
}

public class PostListCommentDto
{
    public IEnumerable<CommentReadDto>? Comments { get; set; } = null!;
}