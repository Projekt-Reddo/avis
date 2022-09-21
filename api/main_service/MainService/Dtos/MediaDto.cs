namespace MainService.Dtos;

public class MediaReadDto
{
    public string Id { get; set; } = null!;

    public string MediaType { get; set; } = null!;

    public string MimeType { get; set; } = null!;

    public string Url { get; set; } = null!;
}
