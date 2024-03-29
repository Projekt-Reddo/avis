using MongoDB.Bson;

namespace MainService.Dtos;

public class PostCreateDto
{
	public string? Content { get; set; } = null!;

	public ICollection<IFormFile>? Medias { get; set; } = null!;

	public List<string>? HashTags { get; set; } = null!;

	public DateTime? PublishedAt { get; set; }

	public string DisplayStatus { get; set; } = null!;
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

	public ICollection<string> UpvotedBy { get; set; } = null!;

	public ICollection<string> DownvotedBy { get; set; } = null!;

	public ICollection<string> Hashtags { get; set; } = null!;

	public AccountReadDto? User { get; set; } = null!;

	public int Comment { get; set; }

	public bool IsDeleted { get; set; } = false;
}

public class PostUpdateDto
{
	public string? Content { get; set; } = null!;
}

public class PostStatusUpdateDto
{
	public PostStatusUpdateDto(string DisplayStatus)
	{
		this.DisplayStatus = DisplayStatus;
	}
	public string? DisplayStatus { get; set; } = null!;
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

	public ICollection<string> UpvotedBy { get; set; } = null!;

	public ICollection<string> DownvotedBy { get; set; } = null!;

	public ICollection<string> Hashtags { get; set; } = null!;

	public int CommentCount { get; set; }
}

public class PostListCommentDto
{
	public IEnumerable<CommentReadDto>? Comments { get; set; } = null!;
}

public class HashtagsRecommend
{
	public HashtagsRecommend(string Popular, HashSet<string> randomHashtags)
	{
		this.Popular = Popular;
		RandomHashtags = randomHashtags;
	}

	public string Popular { get; set; } = null!;
	public ICollection<string> RandomHashtags { get; set; } = null!;
}

public class VoteDto
{
	public string VoteId { get; set; } = null!;

	public bool isUpvote { get; set; }

	public bool isVotePost { get; set; }
}
