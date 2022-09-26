using MainService.Dtos;
using MainService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using static Constants;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InternalController : ControllerBase // Health check controller
{
    private readonly IHumSvcClient _humSvcClient;
    private readonly IConfiguration _configuration;

    public InternalController(IHumSvcClient humSvcClient, IConfiguration configuration)
    {
        _humSvcClient = humSvcClient;
        _configuration = configuration;
    }

    [HttpGet("health-check")]
    public async Task<ActionResult> HealthCheck()
    {
        var _ = await _humSvcClient.HealthCheck();
        return Ok("Towa-sama maji tenshi!");
    }

    [HttpPost("grant-admin-role")]
    public async Task<ActionResult> GrantAdMinRole(AdminRoleCreateDto adminRoleCreateDto)
    {
        string secretKey = _configuration.GetValue<string>("SecretKey");

        // The server does not have a secret key
        if (string.IsNullOrWhiteSpace(secretKey))
        {
            throw new Exception("No secret key found!");
        }

        // The user send an invalid secret key
        if (adminRoleCreateDto.Secret != secretKey)
        {
            return BadRequest("Wrong credential!");
        }

        await FirebaseService.SetRoleClaim(adminRoleCreateDto.Uid, AccountRoles.ADMIN);

        return Ok("Admin role granted!");
    }
}
