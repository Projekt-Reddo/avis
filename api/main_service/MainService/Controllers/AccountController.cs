using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MainService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IAccountRepo _accountRepo;


        public AccountController(IMapper mapper, IAccountRepo accountRepo)
        {
            _mapper = mapper;
            _accountRepo = accountRepo;
        }

        [HttpPost("signup")]
        public async Task<ActionResult<ResponseDto>> Signup([FromBody] AccountCreateDto newAccount)
        {
            var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Email", newAccount.Email));

            if (accountFromRepo is not null)
            {
                return BadRequest(new ResponseDto(400, "Email duplicated!"));
            }

            var account = _mapper.Map<Account>(newAccount);
            var _ = await _accountRepo.AddOneAsync(account);

            return Ok(new ResponseDto(200, "Account created successfully"));
        }
    }
}
