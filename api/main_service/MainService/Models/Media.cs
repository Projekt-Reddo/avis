namespace MainService.Models;

public class Media : IdAttrModel
{
    public string MediaType { get; set; } = null!;

    public string MimeType { get; set; } = null!;

    public string Url { get; set; } = null!;
}