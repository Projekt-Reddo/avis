
namespace MainService.Dtos
{
    public class SongFilterDto
    {
        public string? Name { get; set; } = null!;

        public ICollection<string>? Genres { get; set; } = null!;

        public DateTime? CreatedStart { get; set; }

        public DateTime? CreatedEnd { get; set; }

        public DateTime? ModifiedStart { get; set; }

        public DateTime? ModifiedEnd { get; set; }
    }
}