using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

/// <summary>
/// Storing related urls
/// </summary>
[BsonIgnoreExtraElements]
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