using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MainService.Dtos
{
    public class PostDto
    {
        public string Content { get; set; } = null!;

        public List<string> Images { get; set; } = null!;

        [Url]
        public string Audios { get; set; } = null!;

        [Url]
        public string Videos { get; set; } = null!;

        public int UpVote { get; set; }

        public int DownVote { get; set; }

        public List<string> Tags { get; set; } = null!;

        public string UserId { get; set; } = null!;

    }
}