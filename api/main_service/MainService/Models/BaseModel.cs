using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models
{
    /// <summary>
    /// Base class for all models
    /// </summary>
    public class BaseModel
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = "";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime LastEdit { get; set; }
    }
}