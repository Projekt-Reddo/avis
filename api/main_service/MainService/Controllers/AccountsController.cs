using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using Microsoft.AspNetCore.Http;
using MainService.Logic;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using FirebaseAdmin.Auth;
using Hangfire;
using System.Reflection.Metadata;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using MainService.Utils;

namespace MainService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IAccountRepo _accountRepo;
        private readonly IAccountLogic _accountLogic;

        public AccountsController(IMapper mapper, IAccountRepo accountRepo, IAccountLogic accountLogic)
        {
            _mapper = mapper;
            _accountRepo = accountRepo;
            _accountLogic = accountLogic;
        }

        [HttpPost("signup")]
        public async Task<ActionResult<ResponseDto>> Signup([FromBody] AccountCreateDto newAccount)
        {
            // To check whether email exist or not.
            var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Email", newAccount.Email));

            // Email cannot be duplicated due to the database design.
            if (accountFromRepo is not null)
            {
                return BadRequest(new ResponseDto(400, ResponseMessage.ACCOUNT_EMAIL_DUPLICATED));
            }

            var account = await _accountLogic.SetupNewAccount(newAccount);

            if (account != null)
            {
                return Ok(new ResponseDto(200, ResponseMessage.ACCOUNT_CREATE_SUCCESS));
            }

            return new ResponseDto(500, ResponseMessage.ACCOUNT_CREATE_FAILED);
        }

        [HttpPost("google-login")]
        public async Task<ActionResult<ResponseDto>> GoogleLogin([FromBody] AccountCreateDto newAccount)
        {
            // To check whether email exist or not.
            var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Email", newAccount.Email));

            // Email cannot be duplicated due to the database design.
            if (accountFromRepo is not null)
            {
                return Ok(new ResponseDto(200, ResponseMessage.ACCOUNT_GOOGLE_LOGIN_SUCCESS));
            }

            var account = await _accountLogic.SetupNewAccount(newAccount);

            if (account != null)
            {
                return Ok(new ResponseDto(200, ResponseMessage.ACCOUNT_CREATE_SUCCESS));
            }

            return new ResponseDto(500, ResponseMessage.ACCOUNT_CREATE_FAILED);
        }

        [Authorize]
        [HttpPost("filter")]
        public async Task<ActionResult<PaginationResDto<IEnumerable<AccountResponseDto>>>> ViewUser([FromBody] PaginationReqDto<AccountFilterDto> pagination)
        {
            var role = User.FindFirst(ClaimTypes.Role)!.Value;

            // Create Account Filter
            var accountFilter = _accountLogic.AccountFilter(pagination, role);

            // Pagination formula
            var skipPage = (pagination.Page - 1) * pagination.Size;

            var sort = _accountLogic.SortFilter(pagination.Filter.Sort);

            (var totalAccount, var accountsFromRepo) = await _accountRepo.FindManyAsync(filter: accountFilter, sort: sort, limit: pagination.Size, skip: skipPage);

            var accounts = _mapper.Map<IEnumerable<AccountResponseDto>>(accountsFromRepo);

            return Ok(new PaginationResDto<AccountResponseDto>((Int32)totalAccount, accounts));
        }

        [HttpGet("profile/{uid}")]
        public async Task<ActionResult<AccountProfileReadDto>> ViewProfile([FromRoute] string uid) {
            // To check whether account exist or not.
            var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Uid", uid));

            // Account not found
            if (accountFromRepo is null)
            {
                return NotFound(new ResponseDto(404, ResponseMessage.ACCOUNT_NOT_FOUND));
            }

            var returnedAccount = _mapper.Map<AccountProfileReadDto>(accountFromRepo);

            return returnedAccount;
        }

        [HttpPut("profile/{uid}")]
        public async Task<ActionResult<AccountProfileReadDto>> UpdateProfile([FromRoute] string uid, [FromForm] AccountProfileUpdateDto accountProfileUpdateDto)
        {
            (bool _, string message, Account? data) = await _accountLogic.UpdateAccountProfile(uid, accountProfileUpdateDto);

            if (data is null)
            {
                return BadRequest(new ResponseDto(400, message));
            }

            var returnedAccount = _mapper.Map<AccountProfileReadDto>(data);

            return returnedAccount;
        }
    }
}
