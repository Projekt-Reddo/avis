using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Logic;

public interface ISongLogic
{
    Task UploadNewSongToStorage(string songId, Stream stream, string contentType);
    FilterDefinition<Song> SongFilter(PaginationReqDto<SongFilterDto> pagination);
}

public class SongLogic : ISongLogic
{
    private readonly IS3Service _s3Service;
    private readonly IConfiguration _configuration;

    public SongLogic(IS3Service s3Service, IConfiguration configuration)
    {
        _s3Service = s3Service;
        _configuration = configuration;
    }

    public async Task UploadNewSongToStorage(string songId, Stream stream, string contentType)
    {
        await _s3Service.UploadFileAsync(
                _configuration.GetValue<string>("S3:SongsBucket"),
                S3Config.SONGS_FOLDER,
                songId,
                stream,
                contentType,
                null!
            );
    }

    public FilterDefinition<Song> SongFilter(PaginationReqDto<SongFilterDto> pagination)
    {

        var songFilter = Builders<Song>.Filter.Empty;

        // Name Filter
        if (pagination.Filter.Name != null)
        {
            songFilter = songFilter & Builders<Song>.Filter.Regex("Title", new BsonRegularExpression(pagination.Filter.Name, "i"));
        }

        // Genres Filter
        if (pagination.Filter.Genres != null)
        {
            songFilter = songFilter & Builders<Song>.Filter.All(x => x.Genres, pagination.Filter.Genres);
        }

        // Created At Filter
        if (pagination.Filter.CreatedStart != null)
        {
            songFilter = songFilter & Builders<Song>.Filter.Gte(x => x.CreatedAt, pagination.Filter.CreatedStart);
        }

        if (pagination.Filter.CreatedEnd != null)
        {
            songFilter = songFilter & Builders<Song>.Filter.Lte(x => x.CreatedAt, pagination.Filter.CreatedEnd);
        }

        // Modified At Filter
        if (pagination.Filter.ModifiedStart != null)
        {
            songFilter = songFilter & Builders<Song>.Filter.Gte(x => x.ModifiedAt, pagination.Filter.ModifiedStart);
        }

        if (pagination.Filter.ModifiedEnd != null)
        {
            songFilter = songFilter & Builders<Song>.Filter.Lte(x => x.ModifiedAt, pagination.Filter.ModifiedEnd);
        }

        return songFilter;
    }
}