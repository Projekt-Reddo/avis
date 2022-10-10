using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Principal;
using static Constants;

namespace MainService.Logic
{
    public interface IAccountLogic
    {
        FilterDefinition<Account> AccountFilter(PaginationReqDto<AccountFilterDto> pagination);

        BsonDocument SortFilter(string Sort);

        Task<Account> SetupNewAccount(AccountCreateDto newAccount);

        Task SetClaimWhenSignUp(Account account);

        Account SetAccountDefaultValues(AccountCreateDto newAccount);

        FilterDefinition<Account> AccountFilterId(string userId);

        Task<Account> GetAccountById(string userId);
    }
    public class AccountLogic : IAccountLogic
    {
        private readonly IS3Service _s3Service;
        private readonly IConfiguration _configuration;
        private IAccountRepo _accountRepo;
        private IPostRepo _postRepo;
        private IReportRepo _reportRepo;
        private readonly IMapper _mapper;

        public AccountLogic(IS3Service s3Service, IConfiguration configuration, IAccountRepo accountRepo, IPostRepo postRepo, IReportRepo reportRepo, IMapper mapper)
        {
            _s3Service = s3Service;
            _configuration = configuration;
            _accountRepo = accountRepo;
            _postRepo = postRepo;
            _reportRepo = reportRepo;
            _mapper = mapper;
        }

        public FilterDefinition<Account> AccountFilter(PaginationReqDto<AccountFilterDto> pagination)
        {
            var accountFilter = Builders<Account>.Filter.Empty;

            if (pagination.Filter.Name != null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Regex("Name", new BsonRegularExpression(pagination.Filter.Name, "i"));
            }

            if (pagination.Filter.JoinedStart == null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Gte(x => x.CreatedAt, DateTime.MinValue);
            } else
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Gte(x => x.CreatedAt, pagination.Filter.JoinedStart);
            }

            if (pagination.Filter.JoinedEnd == null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Lte(x => x.CreatedAt, DateTime.MaxValue);
            } else
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Lte(x => x.CreatedAt, pagination.Filter.JoinedEnd);
            }

            if (pagination.Filter.isBanned)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Status.IsBanned == true);
            }

            if (pagination.Filter.isModerator)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Role == "admin");
            }

            if (pagination.Filter.isMuted)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Status.CommentMutedUntil >= DateTime.Now || x.Status.PostMutedUntil >= DateTime.Now);
            }

            return accountFilter;
        }

        public BsonDocument SortFilter(string sortFilter)
        {
            string sortType = "";

            int adesc = 1;

            switch (sortFilter)
            {
                case Constants.UserSortFilterOption.NAME_DESC:
                    sortType = "Name";
                    adesc = -1;
                    break;
                case Constants.UserSortFilterOption.JOIN_ASC:
                    sortType = "CreatedAt";
                    adesc = 1;
                    break;
                case Constants.UserSortFilterOption.JOIN_DESC:
                    sortType = "CreatedAt";
                    adesc = -1;
                    break;
                default:
                    sortType = "Name";
                    adesc = 1;
                    break;
            }

            BsonDocument sort = new BsonDocument
            {
                { sortType, adesc }
            };

            return sort;
        }

        public async Task<Account> SetupNewAccount(AccountCreateDto newAccount)
        {
            // Set account default values if missing.
            var account = SetAccountDefaultValues(newAccount);

            // set Firebase claims for front-end handle.
            await SetClaimWhenSignUp(account);

            var res = await _accountRepo.AddOneAsync(account);

            return res;
        }

        public Account SetAccountDefaultValues(AccountCreateDto newAccount)
        {
            newAccount.Avatar ??= DEFAULT_AVATAR;

            var account = _mapper.Map<Account>(newAccount);

            account.Role = AccountRoles.USER;

            return account;
        }

        public async Task SetClaimWhenSignUp(Account account)
        {
            await FirebaseService.SetRoleClaim(account.Uid, AccountRoles.USER);
            await FirebaseService.SetNameClaim(account.Uid, account.Name);
            await FirebaseService.SetNameClaim(account.Uid, account.Avatar);
            await FirebaseService.SetInitiatedClaim(account.Uid);
        }

        public FilterDefinition<Account> AccountFilterId(string userId){
            var accountFilter = Builders<Account>.Filter.Empty;
            return accountFilter;
        }

        public async Task<Account> GetAccountById(string userId){
            var accountFilter = AccountFilterId(userId);
            var accountsFromRepo = await _accountRepo.FindOneAsync(filter: accountFilter);
            return accountsFromRepo;
        }
    }
}