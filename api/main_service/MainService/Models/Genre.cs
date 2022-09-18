using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

[BsonIgnoreExtraElements]
public class Genre : IdAttrModel
{
    public string Name { get; set; } = null!;
}