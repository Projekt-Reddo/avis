using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models
{
    /// <summary>
    /// Post model storing all information about a post
    /// </summary>
    public class Post : BaseModel
    {
        public string Content { get; set; } = null!;

        public List<string> Images { get; set; } = null!;

        [Url]
        public string Audios { get; set; } = null!;

        [Url]
        public string Videos { get; set; } = null!;

        [Range(0, int.MaxValue)]
        public int UpVote { get; set; }

        [Range(0, int.MaxValue)]
        public int DownVote { get; set; }

        public List<string> Tags { get; set; } = null!;

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string UserId { get; set; } = null!;
    }
}