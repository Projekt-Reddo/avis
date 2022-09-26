using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using static Constants;

namespace MainService.Services;

public interface IHumSvcClient
{
    /// <summary>
    /// Search songs ids with hum input
    /// </summary>
    /// <param name="file">Hum file</param>
    /// <returns></returns>
    Task<IList<string>?> GetSongIdsByHum(IFormFile file);

    Task<bool> HealthCheck();
}

public class HumSvcClient : IHumSvcClient
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _humSvcUrl;

    public HumSvcClient(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _humSvcUrl = configuration.GetValue<string>("Services:Hum");
    }

    public async Task<IList<string>?> GetSongIdsByHum(IFormFile file)
    {
        using var client = _httpClientFactory.CreateClient(PollyHttpClient.CLIENT_NAME);
        var url = $"{_humSvcUrl}/songs/hum";

        // Multipart-form
        using var formContent = new MultipartFormDataContent();
        var fileStreamContent = new StreamContent(file.OpenReadStream());
        fileStreamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
        formContent.Add(fileStreamContent, name: "hum_file", fileName: file.FileName);

        var response = await client.PostAsync(url, formContent);
        var content = await response.Content.ReadAsStringAsync();
        if (response.IsSuccessStatusCode)
        {
            dynamic obj = JsonConvert.DeserializeObject<dynamic>(
                content,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }
            )!;

            return ((JArray)obj.result).ToObject<List<string>>() ?? null;
        }

        return null;
    }

    public async Task<bool> HealthCheck()
    {
        using var client = _httpClientFactory.CreateClient(PollyHttpClient.CLIENT_NAME);
        var url = $"{_humSvcUrl}/health";

        var response = await client.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();
        if (response.IsSuccessStatusCode)
        {
            return true;
        }

        return false;
    }
}