using static Constants;

namespace MainService.Services;

public interface IFileStorageService
{

    /// <summary>
    /// Upload new image to configured location
    /// </summary>
    /// <param name="fileName">file name with file extension</param>
    /// <param name="fileStream"></param>
    /// <param name="contentType"></param>
    /// <returns></returns>
    Task<(bool, string)> UploadImage(string fileName, Stream fileStream, string contentType);

    /// <summary>
    /// Upload new video to configured location
    /// </summary>
    /// <param name="fileName">file name with file extension</param>
    /// <param name="fileStream"></param>
    /// <param name="contentType"></param>
    /// <returns></returns>
    Task<(bool, string)> UploadVideo(string fileName, Stream fileStream, string contentType);

    /// <summary>
    /// Upload new audio to configured location
    /// </summary>
    /// <param name="fileName">file name with file extension</param>
    /// <param name="fileStream"></param>
    /// <param name="contentType"></param>
    /// <returns></returns>
    Task<(bool, string)> UploadAudio(string fileName, Stream fileStream, string contentType);

    /// <summary>
    /// Upload new song to configured location
    /// </summary>
    /// <param name="fileName">file name with file extension</param>
    /// <param name="fileStream"></param>
    /// <param name="contentType"></param>
    /// <returns></returns>
    Task<(bool, string)> UploadSong(string fileName, Stream fileStream, string contentType);
}

public class FileStorageService : IFileStorageService
{
    private readonly IS3Service _s3Service;
    private readonly IConfiguration _configuration;

    public FileStorageService(IS3Service s3Service, IConfiguration configuration)
    {
        _s3Service = s3Service;
        _configuration = configuration;
    }

    public async Task<(bool, string)> UploadImage(string fileName, Stream fileStream, string contentType)
    {
        (var uploadStatus, var url) = await _s3Service.UploadFileAsync(
            _configuration.GetValue<string>("S3:ResourcesBucket"),
            S3Config.IMAGES_FOLDER,
            $"{fileName}",
            fileStream,
            contentType,
            null!);

        return (uploadStatus, url);
    }

    public async Task<(bool, string)> UploadVideo(string fileName, Stream fileStream, string contentType)
    {
        (var uploadStatus, var url) = await _s3Service.UploadFileAsync(
            _configuration.GetValue<string>("S3:ResourcesBucket"),
            S3Config.VIDEOS_FOLDER,
            $"{fileName}",
            fileStream,
            contentType,
            null!);

        return (uploadStatus, url);
    }

    public async Task<(bool, string)> UploadAudio(string fileName, Stream fileStream, string contentType)
    {
        (var uploadStatus, var url) = await _s3Service.UploadFileAsync(
            _configuration.GetValue<string>("S3:ResourcesBucket"),
            S3Config.AUDIOS_FOLDER,
            $"{fileName}",
            fileStream,
            contentType,
            null!);

        return (uploadStatus, url);
    }

    public async Task<(bool, string)> UploadSong(string fileName, Stream fileStream, string contentType)
    {
        (var uploadStatus, var url) = await _s3Service.UploadFileAsync(
            _configuration.GetValue<string>("S3:SongsBucket"),
            S3Config.SONGS_FOLDER,
            $"{fileName}",
            fileStream,
            contentType,
            null!);

        return (uploadStatus, url);
    }
}
