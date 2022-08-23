using System.ComponentModel.DataAnnotations;

namespace MainService.Dtos;

public class SongReadDto
{
    public string Id { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime ModifiedAt { get; set; }

    public string Title { get; set; } = null!;

    public string Alias { get; set; } = null!;

    public string Thumbnail { get; set; } = null!;

    public string Lyric { get; set; } = null!;

    public string Description { get; set; } = null!;

    public ICollection<string> Genres { get; set; } = null!;

    public ICollection<ArtistReadDto> Artist { get; set; } = null!;

    public UrlReadDto Url { get; set; } = null!;
}

public class SongCreateDto
{
    [StringLength(300)]
    public string Title { get; set; } = null!;

    public string Alias { get; set; } = null!;

    public IFormFile Thumbnail { get; set; } = null!;

    public string Lyric { get; set; } = null!;

    public string Description { get; set; } = null!;

    public HashSet<string> Genres { get; set; } = null!;

    public IFormFile File { get; set; } = null!;
}

public class SongUpdateDto
{
    [StringLength(300)]
    public string Title { get; set; } = null!;

    public string Alias { get; set; } = null!;

    public IFormFile Thumbnail { get; set; } = null!;

    public string Lyric { get; set; } = null!;

    public string Description { get; set; } = null!;

    public HashSet<string> Genres { get; set; } = null!;

    public IFormFile File { get; set; } = null!;
}