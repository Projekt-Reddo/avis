using MainService.Services;
using static Constants;

namespace MainService.Logic;

public interface ISongLogic
{
    Task UploadNewSongToStorage(string songId, Stream stream, string contentType);
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
}