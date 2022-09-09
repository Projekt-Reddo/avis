using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Logic;

public interface ISongLogic
{
    FilterDefinition<Song> SongFilter(PaginationReqDto<SongFilterDto> pagination);
    Task<bool> UploadNewSong(Song song, Stream stream, string contentType);
    Task<bool> UploadNewThumbnail(Song song, Stream stream, string contentType);
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
    private readonly ISongRepo _songRepo;

    public SongLogic(IS3Service s3Service, IConfiguration configuration, ISongRepo songRepo)
    {
        _s3Service = s3Service;
        _configuration = configuration;
        _songRepo = songRepo;
    }

    public async Task<bool> UploadNewSong(Song song, Stream stream, string contentType)
    {
        (var songUploadStatus, var songUrl) = await _s3Service.UploadFileAsync(
            _configuration.GetValue<string>("S3:SongsBucket"),
            S3Config.SONGS_FOLDER,
            song.Id,
            stream,
            contentType,
            null!
        );

        if (songUploadStatus is false)
        {
            return false;
        }

        song.Url.Internal = songUrl;
        var rs = await UpdateSong(song.Id, song);
        return rs;
    }

    public async Task<bool> UploadNewThumbnail(Song song, Stream stream, string contentType)
    {
        (var thumbnailUploadStatus, var thumbnailUrl) = await _s3Service.UploadFileAsync(
            _configuration.GetValue<string>("S3:ResourcesBucket"),
            S3Config.IMAGES_FOLDER,
            song.Id,
            stream,
            contentType,
            null!
        );

        if (thumbnailUploadStatus is false)
        {
            song.Thumbnail = _configuration.GetValue<string>("S3:DefaultSongThumbnail");
        }
        else
        {
            song.Thumbnail = thumbnailUrl;
        }

        var rs = await UpdateSong(song.Id, song);
        return rs;
    }

    public async Task<bool> UpdateSong(string songId, Song song)
    {
        var rs = await _songRepo.UpdateOneAsync(songId, song);
        return rs;
    }
}