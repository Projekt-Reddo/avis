namespace MainService.Models;

public class Artist : IdAttrModel
{
    public string Name { get; set; } = null!;

    public string Alias { get; set; } = null!;

    public string Thumbnail { get; set; } = null!;
}