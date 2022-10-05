
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
}