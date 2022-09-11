namespace MainService.Dtos;

public class ArtistReadDto
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Alias { get; set; } = null!;

    public string Thumbnail { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}

public class ArtistViewSongDto
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
}