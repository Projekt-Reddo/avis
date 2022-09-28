using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Principal;
using static Constants;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InternalController : ControllerBase // Health check controller
{
    private readonly IHumSvcClient _humSvcClient;
    private readonly IConfiguration _configuration;
    private readonly IAccountRepo _accountRepo;

    public InternalController(IHumSvcClient humSvcClient, IConfiguration configuration, IAccountRepo accountRepo)
    {
        _humSvcClient = humSvcClient;
        _configuration = configuration;
        _accountRepo = accountRepo;
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
        string secretKey = Environment.GetEnvironmentVariable("API_SECRET_KEY") ?? _configuration.GetValue<string>("ApiSecretKey");

        // The server does not have a secret key
        if (string.IsNullOrWhiteSpace(secretKey))
        {
            throw new Exception("No secret key found!");
        }

        // The user send an invalid secret key
        if (adminRoleCreateDto.Secret != secretKey)
        {
            return BadRequest(new ResponseDto(400, "Wrong credential!"));
        }

        // To check whether uid exist or not.
        var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Uid", adminRoleCreateDto.Uid));

        if (accountFromRepo == null)
        {
            return BadRequest(new ResponseDto(400, "No Uid found!"));
        }

        await FirebaseService.SetRoleClaim(adminRoleCreateDto.Uid, AccountRoles.ADMIN);

        // Assign role to database
        accountFromRepo.Role = AccountRoles.ADMIN;
        await _accountRepo.ReplaceOneAsync(accountFromRepo.Id, accountFromRepo);

        return Ok(new ResponseDto(200, "Admin role granted!"));
    }
}
