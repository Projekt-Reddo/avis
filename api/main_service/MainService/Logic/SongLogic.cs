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
    Task<bool> UploadNewSong(Song song, Stream stream, string contentType, string fileExtension);
    Task<bool> UploadNewThumbnail(Song song, Stream stream, string contentType, string fileExtension);
    FilterDefinition<Song> SongFilter(PaginationReqDto<SongFilterDto> pagination);
    Task<Song?> GetSongById(string id);
    Task<IEnumerable<Song>> GetSongByGenres(ICollection<string> genres, string existedId);
}

public class SongLogic : ISongLogic
{
    private readonly IS3Service _s3Service;
    private readonly IConfiguration _configuration;
    private readonly ISongRepo _songRepo;
    private readonly ILogger<SongLogic> _logger;
    private BsonDocument artistLookup = new BsonDocument {
            { "from", "artist" },
            { "localField", "ArtistIds" },
            { "foreignField", "_id" },
            { "as", "Artists" }
        };
    private FilterDefinition<Song> availableSongFilter = Builders<Song>.Filter.Not(Builders<Song>.Filter.Eq(x => x.IsDeleted, true));

    public SongLogic(
        IS3Service s3Service,
        IConfiguration configuration,
        ISongRepo songRepo,
        ILogger<SongLogic> logger
    )
    {
        _s3Service = s3Service;
        _configuration = configuration;
        _songRepo = songRepo;
        _logger = logger;
    }

    public async Task<bool> UploadNewSong(Song song, Stream stream, string contentType, string fileExtension)
    {
        (var songUploadStatus, var songUrl) = await _s3Service.UploadFileAsync(
            _configuration.GetValue<string>("S3:SongsBucket"),
            S3Config.SONGS_FOLDER,
            $"{song.Id}{fileExtension}",
            stream,
            contentType,
            null!
        );

        if (songUploadStatus is false)
        {
            return false;
        }

        if (song.Url is null)
        {
            song.Url = new Url();
        }
        song.Url.Internal = songUrl;
        var rs = await UpdateSong(song.Id, song);
        return rs;
    }

    public async Task<bool> UploadNewThumbnail(Song song, Stream stream, string contentType, string fileExtension)
    {
        (var thumbnailUploadStatus, var thumbnailUrl) = await _s3Service.UploadFileAsync(
            _configuration.GetValue<string>("S3:ResourcesBucket"),
            S3Config.IMAGES_FOLDER,
            $"{song.Id}{fileExtension}",
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
        var rs = await _songRepo.ReplaceOneAsync(songId, song);
        return rs;
    }

    public FilterDefinition<Song> SongFilter(PaginationReqDto<SongFilterDto> pagination)
    {

        var songFilter = Builders<Song>.Filter.Not(Builders<Song>.Filter.Eq(x => x.IsDeleted, true));

        // Name Filter
        if (!String.IsNullOrWhiteSpace(pagination.Filter.Title))
        {
            songFilter = songFilter & Builders<Song>.Filter.Regex("Title", new BsonRegularExpression(pagination.Filter.Title, "i"));
        }

        // Genres Filter
        if (pagination.Filter.Genres != null)
        {
            songFilter = songFilter & Builders<Song>.Filter.All(x => x.Genres, pagination.Filter.Genres);
        }

        // Created At Filter
        if (!String.IsNullOrWhiteSpace(pagination.Filter.CreatedStart.ToString()))
        {
            songFilter = songFilter & Builders<Song>.Filter.Gte(x => x.CreatedAt, pagination.Filter.CreatedStart);
        }

        if (!String.IsNullOrWhiteSpace(pagination.Filter.CreatedEnd.ToString()))
        {
            songFilter = songFilter & Builders<Song>.Filter.Lte(x => x.CreatedAt, pagination.Filter.CreatedEnd);
        }

        // Modified At Filter
        if (!String.IsNullOrWhiteSpace(pagination.Filter.ModifiedStart.ToString()))
        {
            songFilter = songFilter & Builders<Song>.Filter.Gte(x => x.ModifiedAt, pagination.Filter.ModifiedStart);
        }

        if (pagination.Filter.ModifiedEnd != null)
        {
            songFilter = songFilter & Builders<Song>.Filter.Lte(x => x.ModifiedAt, pagination.Filter.ModifiedEnd);
        }

        return songFilter;
    }

    public async Task<Song?> GetSongById(string id)
    {
        try
        {
            var filter = Builders<Song>.Filter.Eq(x => x.Id, id)
                         & availableSongFilter;

            var song = await _songRepo.FindOneAsync(
                filter: filter,
                lookup: artistLookup
            );

            return song;
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return null;
        }
    }

    public async Task<IEnumerable<Song>> GetSongByGenres(ICollection<string> genres, string existedId)
    {
        try
        {
            var filter = Builders<Song>.Filter.AnyIn(x => x.Genres, genres) & availableSongFilter
                & Builders<Song>.Filter.Not(Builders<Song>.Filter.Eq(x => x.Id, existedId));

            (_, var songs) = await _songRepo.FindManyAsync(
                filter: filter,
                lookup: artistLookup,
                limit: 10
            );

            return songs;
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return Enumerable.Empty<Song>();
        }
    }
}