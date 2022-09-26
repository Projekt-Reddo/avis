using MainService.Services;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuiChanController : ControllerBase // Health check controller
{
    private readonly IHumSvcClient _humSvcClient;

    public SuiChanController(IHumSvcClient humSvcClient)
    {
        _humSvcClient = humSvcClient;
    }

    [HttpGet("wa")]
    public async Task<ActionResult> SuiChan()
    {
        var humSvcStatus = await _humSvcClient.HealthCheck();
        return Ok("Kyou mo kawaii~");
    }
}
