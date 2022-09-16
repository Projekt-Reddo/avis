using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MongoDB.Driver;

namespace MainService.Logic;

public interface IArtistLogic
{
    Task<bool> Create(ArtistCreateDto createDto);
    Task<int> CreateMany(ICollection<ArtistCreateDto> createManyDto);
    Task<ICollection<ArtistReadDto>> GetAllGenre();
    Task<bool> Delete(string id);
    Task<int> DeleteMany(ArtistManyDeleteDto deleteManyDto);
    Task<Artist> GetById(string id);
    Task<IEnumerable<Artist>> GetByName(string name);
}

public class ArtistLogic : IArtistLogic
{
    private readonly IArtistRepo _artistRepo;
    private readonly IMapper _mapper;
    private readonly IS3Service _s3Service;

    public ArtistLogic(
        IArtistRepo artistRepo,
        IMapper mapper,
        IS3Service s3Service
    )
    {
        _artistRepo = artistRepo;
        _mapper = mapper;
        _s3Service = s3Service;
    }

    public async Task<bool> Create(ArtistCreateDto createDto)
    {
        var entity = _mapper.Map<Artist>(createDto);
        await _artistRepo.AddOneAsync(entity);
        return true;
    }

    public async Task<int> CreateMany(ICollection<ArtistCreateDto> createManyDto)
    {
        var successCount = 0;
        foreach (var item in createManyDto)
        {
            var isSuccess = await Create(item);
            if (isSuccess == true)
            {
                successCount += 1;
            }
        }
        return successCount;
    }

    public async Task<bool> Delete(string id)
    {
        var rs = await _artistRepo.DeleteOneAsync(id);
        return rs;
    }

    public async Task<int> DeleteMany(ArtistManyDeleteDto deleteManyDto)
    {
        var successCount = 0;
        foreach (var item in deleteManyDto.Ids)
        {
            var isSuccess = await Delete(item);
            if (isSuccess == true)
            {
                successCount += 1;
            }
        }
        return successCount;
    }

    public async Task<ICollection<ArtistReadDto>> GetAllGenre()
    {
        (_, var entities) = await _artistRepo.FindManyAsync();
        return _mapper.Map<ICollection<ArtistReadDto>>(entities);
    }

    public async Task<Artist> GetById(string id)
    {
        var filter = Builders<Artist>.Filter.Eq(x => x.Id, id);
        var rs = await _artistRepo.FindOneAsync(filter);
        return rs;
    }

    public async Task<IEnumerable<Artist>> GetByName(string name)
    {
        var filter = Builders<Artist>.Filter.Where(g => g.Name.ToLower().Contains(name.ToLower()));
        (var total, var genres) = await _artistRepo.FindManyAsync(filter: filter);
        if (total == 0)
        {
            return Enumerable.Empty<Artist>();
        }
        return genres;
    }
}
