using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using Microsoft.AspNetCore.Http;
using MainService.Logic;
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
        private readonly IAccountLogic _accountLogic;

        public AccountController(IMapper mapper, IAccountRepo accountRepo, IAccountLogic accountLogic)
        {
            _mapper = mapper;
            _accountRepo = accountRepo;
            _accountLogic = accountLogic;
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

        [HttpPost("filter")]
        public async Task<ActionResult<PaginationResDto<IEnumerable<AccountResponseDto>>>> ViewUser([FromBody] PaginationReqDto<AccountFilterDto> pagination)
        {
            // Create Account Filter
            var accountFilter = _accountLogic.AccountFilter(pagination);

            // Pagination formula
            var skipPage = (pagination.Page - 1) * pagination.Size;

            var sort = _accountLogic.SortFilter(pagination.Filter.Sort);

            (var totalAccount, var accountsFromRepo) = await _accountRepo.FindManyAsync(filter: accountFilter, sort: sort, limit: pagination.Size, skip: skipPage);

            var accounts = _mapper.Map<IEnumerable<AccountResponseDto>>(accountsFromRepo);

            return Ok(new PaginationResDto<AccountResponseDto>((Int32)totalAccount, accounts));
        }
    }
}
