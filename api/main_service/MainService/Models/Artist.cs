using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models;

[BsonIgnoreExtraElements]
public class Artist : IdAttrModel
{
    public string Name { get; set; } = null!;

    public string Alias { get; set; } = null!;

    public string Thumbnail { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}