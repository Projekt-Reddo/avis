using System.ComponentModel.DataAnnotations;

namespace MainService.Dtos;

public class UrlReadDto
{
    public string Internal { get; set; } = null!;

    public string Soundcloud { get; set; } = null!;

    public string Spotify { get; set; } = null!;

    public string Youtube { get; set; } = null!;
}

public class UrlCreateDto
{
    [Url]
    public string? Soundcloud { get; set; } = null!;

    [Url]
    public string? Spotify { get; set; } = null!;

    [Url]
    public string? Youtube { get; set; } = null!;
}

public class UrlUpdateDto
{
    [Url]
    public string? Soundcloud { get; set; } = null!;

    [Url]
    public string? Spotify { get; set; } = null!;

    [Url]
    public string? Youtube { get; set; } = null!;
}
