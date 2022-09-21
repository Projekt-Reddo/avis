using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MongoDB.Driver;

namespace MainService.Logic;

public interface IGenreLogic
{
    Task<bool> CreateGenre(GenreCreateDto genreCreateDto);
    Task<int> CreateManyGenre(GenreManyCreateDto genreManyCreateDto);
    Task<ICollection<GenreReadDto>> GetAllGenre();
    Task<bool> DeleteGerne(string id);
    Task<int> DeleteManyGenre(GenreManyDeleteDto genreManyDeleteDto);
    Task<Genre> GetGenreById(string id);
    Task<IEnumerable<Genre>> GetGenresByName(string name);
}

public class GenreLogic : IGenreLogic
{
    private readonly IGenreRepo _genreRepo;
    private readonly IMapper _mapper;

    public GenreLogic(IGenreRepo genreRepo, IMapper mapper)
    {
        _genreRepo = genreRepo;
        _mapper = mapper;
    }

    public async Task<bool> CreateGenre(GenreCreateDto genreCreateDto)
    {
        var existedGenre = await GetGenresByName(genreCreateDto.Name);
        if (existedGenre.Any())
        {
            return false;
        }

        var genre = _mapper.Map<Genre>(genreCreateDto);
        await _genreRepo.AddOneAsync(genre);
        return true;
    }

    public async Task<int> CreateManyGenre(GenreManyCreateDto genreManyCreateDto)
    {
        var successCount = 0;
        foreach (var item in genreManyCreateDto.Names)
        {
            var genreCreateDto = new GenreCreateDto
            {
                Name = item
            };
            var isSuccess = await CreateGenre(genreCreateDto);
            if (isSuccess == true)
            {
                successCount += 1;
            }
        }
        return successCount;
    }

    public async Task<ICollection<GenreReadDto>> GetAllGenre()
    {
        (_, var genres) = await _genreRepo.FindManyAsync();
        return _mapper.Map<ICollection<GenreReadDto>>(genres);
    }

    public async Task<bool> DeleteGerne(string id)
    {
        var rs = await _genreRepo.DeleteOneAsync(id);
        return rs;
    }

    public async Task<int> DeleteManyGenre(GenreManyDeleteDto genreManyDeleteDto)
    {
        var successCount = 0;
        foreach (var item in genreManyDeleteDto.Ids)
        {
            var isSuccess = await DeleteGerne(item);
            if (isSuccess == true)
            {
                successCount += 1;
            }
        }
        return successCount;
    }

    public async Task<Genre> GetGenreById(string id)
    {
        var filter = Builders<Genre>.Filter.Eq(x => x.Id, id);
        var rs = await _genreRepo.FindOneAsync(filter);
        return rs;
    }

    public async Task<IEnumerable<Genre>> GetGenresByName(string name)
    {
        var filter = Builders<Genre>.Filter.Where(g => g.Name.ToLower().Contains(name.ToLower()));
        (var total, var genres) = await _genreRepo.FindManyAsync(filter: filter);
        if (total == 0)
        {
            return Enumerable.Empty<Genre>();
        }
        return genres;
    }
}
