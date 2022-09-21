using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

/// <summary>
/// Base class with Id, CreatedAt and ModifiedAt
/// </summary>
public class BaseModel
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string Id { get; set; } = "";

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime ModifiedAt { get; set; }
}

/// <summary>
/// Base class with Id only
/// </summary>
public class IdAttrModel
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string Id { get; set; } = "";
}