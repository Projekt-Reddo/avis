using MainService.Data;
using MainService.Models;
using MainService.Services;
using static Constants;

namespace MainService.Logic;

public interface ISongLogic
{
    Task<bool> UploadNewSong(Song song, Stream stream, string contentType);
    Task<bool> UploadNewThumbnail(Song song, Stream stream, string contentType);
}

public class SongLogic : ISongLogic
{
    private readonly IS3Service _s3Service;
    private readonly IConfiguration _configuration;
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