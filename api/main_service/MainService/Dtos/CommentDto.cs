namespace MainService.Dtos
{
    public class CommentCreateDto
    {
        public string Content { get; set; } = null!;
        public string? ParentId { get; set; } = null!;
        public int UpVote { get; set; }
        public int DownVote { get; set; }
        public string UserId { get; set; } = null!;
        public string? PostId { get; set; } = null!;
    }

    public class CommentReadDto
    {
        public string Id { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int UpVote { get; set; }
        public int DownVote { get; set; }
        public UserReadDto? User { get; set; } = null!;
    }

    public class CommentUpdateDto
    {
        public string? Content { get; set; } = null!;
    }

}