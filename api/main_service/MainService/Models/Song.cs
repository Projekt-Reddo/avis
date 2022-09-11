using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace MainService.Models;

/// <summary>
/// Song model storing all information about a song
/// </summary>
public class Song : BaseModel
{
    [StringLength(300)]
    public string Title { get; set; } = null!;

    [StringLength(300)]
    public string Alias { get; set; } = null!;

    [Url]
    public string Thumbnail { get; set; } = null!;

    public string Lyric { get; set; } = null!;

    public string Description { get; set; } = null!;

    public HashSet<string> Genres { get; set; } = null!;

    public Url Url { get; set; } = null!;

    public ICollection<ObjectId> ArtistIds { get; set; } = null!;

    public ICollection<Artist> Artists { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}