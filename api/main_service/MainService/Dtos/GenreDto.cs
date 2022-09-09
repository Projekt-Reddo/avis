namespace MainService.Dtos;

public class GenreReadDto
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;
}

public class GenreCreateDto
{
    public string Name { get; set; } = null!;
}

public class GenreManyCreateDto
{
    public ICollection<string> Names { get; set; } = null!;
}

public class GenreRecommendDto
{
    public string Keyword { get; set; } = null!;
}

public class GenreManyDeleteDto
{
    public ICollection<string> Ids { get; set; } = null!;
}