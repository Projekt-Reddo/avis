namespace MainService.Models;

/// <summary>
/// Storing related urls
/// </summary>
public class Url
{
    public string Internal { get; set; } = null!;

    public string? Soundcloud { get; set; } = null!;

    public string? Spotify { get; set; } = null!;

    public string? Youtube { get; set; } = null!;
}