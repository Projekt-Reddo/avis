using MainService.Filters;

namespace MainService.Dtos
{
	public class SongFilterDto
	{
		public string? Title { get; set; } = null!;

		public ICollection<string>? Genres { get; set; } = null!;

		public DateTime? CreatedStart { get; set; }

		public DateTime? CreatedEnd { get; set; }

		public DateTime? ModifiedStart { get; set; }

		public DateTime? ModifiedEnd { get; set; }
	}

	public class PostFilterDto
	{
		public string? Content { get; set; } = null!;

		public ICollection<string>? Hashtags { get; set; } = null!;

		public bool IsTrending { get; set; } = false!;
	}

	public class UserPostFilterDto
	{
		public string? UserId { get; set; } = null!;
	}

	public class CommentFilterDto
	{
		public string? ObjectId { get; set; } = null!;
		public bool IsPostChild { get; set; } = false;
		public string Sort { get; set; } = null!;
	}

	public class RelatedSongFilter
	{
		public ICollection<string>? Genres { get; set; } = null!;
		public string ExistedId { get; set; } = null!;
	}

	public class ArtistFilterDto
	{
		public string? Name { get; set; } = null!;
	}

	public class ReportFilterDto
	{
		public DateTime? From { get; set; }

		public DateTime? To { get; set; }

		[ValidValues(typeof(Constants.ReportType))]
		public string? Type { get; set; }

		public bool? IsPost { get; set; }
	}

	public class UserNotifyFilterDto
	{

	}
}
