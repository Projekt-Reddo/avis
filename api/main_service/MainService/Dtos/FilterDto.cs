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

	public class CommentFilterDto
	{
		public string? ObjectId { get; set; } = null!;
		public bool IsPostChild { get; set; } = false;
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

		private string? type = string.Empty;
		public string? Type
		{
			get { return type; }
			set
			{
				type = null!;
				foreach (var property in typeof(Constants.ReportType).GetFields())
				{
					if (!String.IsNullOrWhiteSpace(value))
					{
						var x = (property.GetValue(null) ?? "").ToString();
						if (value.ToLower() == (property.GetValue(null) ?? "").ToString()!.ToLower())
						{
							type = value;
						}
					}
				}
			}
		}

		public bool? IsPost { get; set; }
	}
}
