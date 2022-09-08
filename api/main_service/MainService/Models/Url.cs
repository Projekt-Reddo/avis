using System.ComponentModel.DataAnnotations;

namespace MainService.Models;

/// <summary>
/// Storing related urls
/// </summary>
public class Url
{
    [Url]
    public string Internal { get; set; } = null!;

    [Url]
    public string? Soundcloud { get; set; } = null!;

    [Url]
    public string? Spotify { get; set; } = null!;

    [Url]
    public string? Youtube { get; set; } = null!;
}