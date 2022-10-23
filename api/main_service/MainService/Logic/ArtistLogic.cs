using System.Linq;
using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MongoDB.Bson;
using MongoDB.Driver;
namespace MainService.Logic;

public interface IArtistLogic
{
    Task<bool> Create(ArtistCreateDto createDto);
    Task<string> CreateMany(ICollection<ArtistCreateDto> createManyDto);
    Task<ICollection<ArtistReadDto>> GetAll();
	Task<PaginationResDto<ArtistReadDto>> List(PaginationReqDto<ArtistFilterDto> pagination);
	Task<bool> Delete(string id);
    Task<int> DeleteMany(ArtistManyDeleteDto deleteManyDto);
    Task<ArtistReadDto> GetById(string id);
    Task<IEnumerable<Artist>> GetByName(string name);
}

public class ArtistLogic : IArtistLogic
{
    private readonly IArtistRepo _artistRepo;
    private readonly IMapper _mapper;
    private readonly IFileStorageService _fileStorage;

    public ArtistLogic(
        IArtistRepo artistRepo,
        IMapper mapper,
        IFileStorageService fileStorage
    )
    {
        _artistRepo = artistRepo;
        _mapper = mapper;
        _fileStorage = fileStorage;
    }

    public async Task<bool> Create(ArtistCreateDto createDto)
    {
        try
        {
            var entity = _mapper.Map<Artist>(createDto);
            await _artistRepo.AddOneAsync(entity);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<string> CreateMany(ICollection<ArtistCreateDto> createManyDto)
    {
        ICollection<string> failedEntities = new List<string>();
        foreach (var item in createManyDto)
        {
            var isSuccess = await Create(item);
            if (isSuccess != true)
            {
                failedEntities.Append(item.Name);
            }
        }

        if (failedEntities.Any())
            return $"There is an error with: {String.Join(" ", failedEntities)}";
        return String.Empty;
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

	public async Task<PaginationResDto<ArtistReadDto>> List(PaginationReqDto<ArtistFilterDto> pagination)
	{
		var artistFilter = Builders<Artist>.Filter.Not(Builders<Artist>.Filter.Eq(x => x.IsDeleted, true));

		// Name Filter
		if (!String.IsNullOrWhiteSpace(pagination.Filter.Name))
		{
			artistFilter = artistFilter & ( Builders<Artist>.Filter.Regex("Name", new BsonRegularExpression(pagination.Filter.Name, "i")) | Builders<Artist>.Filter.Regex("Alias", new BsonRegularExpression(pagination.Filter.Name, "i")));
		}

		// Pagination formula
		var skipPage = (pagination.Page - 1) * pagination.Size;

		(long total, IEnumerable<Artist> entities) = await _artistRepo.FindManyAsync(
			filter: artistFilter,
			limit: pagination.Size,
			skip: skipPage);

		IEnumerable<ArtistReadDto> artistData = _mapper.Map<IEnumerable<ArtistReadDto>>(entities);

		return new PaginationResDto<ArtistReadDto>((Int32)total, artistData);
	}

	public async Task<ICollection<ArtistReadDto>> GetAll()
    {
        (_, var entities) = await _artistRepo.FindManyAsync();
        return _mapper.Map<ICollection<ArtistReadDto>>(entities);
    }

    public async Task<ArtistReadDto> GetById(string id)
    {
        var filter = Builders<Artist>.Filter.Eq(x => x.Id, id);
        var entity = await _artistRepo.FindOneAsync(filter);
        return _mapper.Map<ArtistReadDto>(entity);
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
