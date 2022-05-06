using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models
{
    /// <summary>
    /// Comment model for storing all information about a comment
    /// </summary>
    public class Comment : BaseModel
    {
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string ParentId { get; set; } = null!;

        public string Content { get; set; } = null!;

        [Range(0, int.MaxValue)]
        public int UpVote { get; set; }

        [Range(0, int.MaxValue)]
        public int DownVote { get; set; }

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string UserId { get; set; } = null!;

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string PostId { get; set; } = null!;
    }
}