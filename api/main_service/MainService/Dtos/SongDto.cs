using System.ComponentModel.DataAnnotations;

namespace MainService.Dtos
{
    public class SongReadDto
    {
        public string Id { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Artist { get; set; } = null!;

        public string Album { get; set; } = null!;

        public string Genre { get; set; } = null!;

        public List<string> Links { get; set; } = null!;

        public string Thumbnail { get; set; } = null!;

        public string Lyric { get; set; } = null!;
    }

    public class SongCreateDto
    {
        [StringLength(300)]
        public string Name { get; set; } = null!;

        public string Artist { get; set; } = null!;

        public string Album { get; set; } = null!;

        public string Genre { get; set; } = null!;

        public List<string> Links { get; set; } = null!;

        [Url]
        public string Thumbnail { get; set; } = null!;

        public string Lyric { get; set; } = null!;
    }

    public class SongUpdateDto
    {
        [StringLength(300)]
        public string Name { get; set; } = null!;

        public string Artist { get; set; } = null!;

        public string Album { get; set; } = null!;

        public string Genre { get; set; } = null!;

        public List<string> Links { get; set; } = null!;

        [Url]
        public string Thumbnail { get; set; } = null!;

        public string Lyric { get; set; } = null!;
    }

}