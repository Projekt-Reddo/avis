namespace MainService.Dtos;

public class ArtistReadDto
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Alias { get; set; } = null!;

    public string Thumbnail { get; set; } = null!;

    public bool IsDeleted { get; set; } = false;
}

public class ArtistCreateDto
{
    public string Name { get; set; } = null!;

    public string? Alias { get; set; } = null!;

    public IFormFile? ThumbnailFile { get; set; } = null!;
}

public class ArtistManyCreateDto
{
    public ICollection<ArtistCreateDto> Artists { get; set; } = null!;
}

public class ArtistManyDeleteDto
{
    public ICollection<string> Ids { get; set; } = null!;
}

public class ArtistRecommendDto
{
    public string Keyword { get; set; } = null!;
}

public class ArtistViewSongDto
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
}
