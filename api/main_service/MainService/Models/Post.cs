using System.ComponentModel.DataAnnotations;
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
        public int UpVote { get; set; } = 0;

        [Range(0, int.MaxValue)]
        public int DownVote { get; set; } = 0;

        public List<string> Tags { get; set; } = null!;

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string UserId { get; set; } = null!;

        /// <summary>
        /// One-to-One relationship between this post and its user
        /// </summary>
        public User? User { get; set; } = null!;

        /// <summary>
        /// One-to-Many relationship between this post and its comments
        /// </summary>
        public IEnumerable<Comment>? Comments { get; set; } = null!;

    }
}