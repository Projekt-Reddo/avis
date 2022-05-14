using System.ComponentModel.DataAnnotations;

namespace MainService.Dtos
{
    public class PostCreateDto
    {
        public string Content { get; set; } = null!;

        public List<string> Images { get; set; } = null!;

        [Url]
        public string Audios { get; set; } = null!;

        [Url]
        public string Videos { get; set; } = null!;

        public List<string> Tags { get; set; } = null!;

        public string? UserId { get; set; } = null!;
    }

    public class PostReadDto
    {
        public string Id { get; set; } = null!;
        public string Content { get; set; } = null!;
        public List<string> Images { get; set; } = null!;
        public string Audios { get; set; } = null!;
        public string Videos { get; set; } = null!;
        public int UpVote { get; set; }
        public int DownVote { get; set; }
        public List<string> Tags { get; set; } = null!;
        public UserReadDto? User { get; set; } = null!;
        public IEnumerable<CommentReadDto>? Comments { get; set; } = null!;
    }

    public class PostUpdateDto
    {
        public string? Content { get; set; } = null!;
    }
}