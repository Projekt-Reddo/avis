using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MainService.Dtos
{
    public class CommentDto
    {
        public string Content { get; set; } = null!;
        public string? ParentId { get; set; } = null!;
        public int UpVote { get; set; }
        public int DownVote { get; set; }
        public string UserId { get; set; } = null!;
        public string? PostId { get; set; } = null!;
    }
}