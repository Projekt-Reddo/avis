using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models
{
    /// <summary>
    /// PortReport model storing all information about a report for a post
    /// </summary>
    public class PostReport : BaseModel
    {
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public int PostId { get; set; }

        [Required]
        public string Reason { get; set; } = null!;

        public string Note { get; set; } = null!;

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string UserId { get; set; } = null!;
    }
}