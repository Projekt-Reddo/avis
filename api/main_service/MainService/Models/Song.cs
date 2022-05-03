using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models
{
    /// <summary>
    /// Song model storing all information about a song
    /// </summary>
    public class Song : BaseModel
    {
        [Required]
        [StringLength(300)]
        public string Name { get; set; } = null!;

        [Required]
        public string Artist { get; set; } = null!;

        public string Album { get; set; } = null!;

        public string Genre { get; set; } = null!;

        [Required]
        public List<string> Links { get; set; } = null!;

        [Url]
        public string Thumbnail { get; set; } = null!;

        public string Lyric { get; set; } = null!;
    }
}