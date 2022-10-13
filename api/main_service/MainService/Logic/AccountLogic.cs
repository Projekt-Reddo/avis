using Amazon.Auth.AccessControlPolicy;
using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IO;
using System.Security.Principal;
using static Constants;

namespace MainService.Logic
{
    public interface IAccountLogic
    {
        FilterDefinition<Account> AccountFilter(PaginationReqDto<AccountFilterDto> pagination,string role);

        BsonDocument SortFilter(string Sort);

        Task<Account> SetupNewAccount(AccountCreateDto newAccount);

        Task SetClaimWhenSignUp(Account account);

        Account SetAccountDefaultValues(AccountCreateDto newAccount);

        FilterDefinition<Account> AccountFilterId(string userId);

        Task<Account?> GetAccountById(string userId);

        Task<Account?> AccountGetAccountByUid(string uid);

        Task<(bool status, string message)> UpdateAccountProfile(string uid, AccountProfileUpdateDto accountProfileUpdateDto);
    }
    public class AccountLogic : IAccountLogic
    {
        private readonly IS3Service _s3Service;
        private readonly IConfiguration _configuration;
        private IAccountRepo _accountRepo;
        private IPostRepo _postRepo;
        private IReportRepo _reportRepo;
        private readonly IMapper _mapper;
        private readonly IFileStorageService _fileStorage;
        private readonly ILogger<SongLogic> _logger;

        public AccountLogic(
            IS3Service s3Service,
            IConfiguration configuration,
            IAccountRepo accountRepo,
            IPostRepo postRepo,
            IReportRepo reportRepo,
            IMapper mapper,
            IFileStorageService fileStorage,
            ILogger<SongLogic> logger
        )
        {
            _s3Service = s3Service;
            _configuration = configuration;
            _accountRepo = accountRepo;
            _postRepo = postRepo;
            _reportRepo = reportRepo;
            _mapper = mapper;
            _fileStorage = fileStorage;
            _logger = logger;
        }

        public FilterDefinition<Account> AccountFilter(PaginationReqDto<AccountFilterDto> pagination, string role)
        {
            var accountFilter = Builders<Account>.Filter.Empty;

            if (pagination.Filter.Name != null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Regex("Name", new BsonRegularExpression(pagination.Filter.Name, "i"));
            }

            if (pagination.Filter.JoinedStart == null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Gte(x => x.CreatedAt, DateTime.MinValue);
            }
            else
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Gte(x => x.CreatedAt, pagination.Filter.JoinedStart);
            }

            if (pagination.Filter.JoinedEnd == null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Lte(x => x.CreatedAt, DateTime.MaxValue);
            }
            else
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Lte(x => x.CreatedAt, pagination.Filter.JoinedEnd);
            }

            if (pagination.Filter.isBanned)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Status.IsBanned == true);
            }

            if (pagination.Filter.isModerator)
            {
                if (role != AccountRoles.ADMIN)
                {
                    accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Role == AccountRoles.USER);
                } else {
                    accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Role == AccountRoles.MODERATOR);
                }
            } else {
                if (role != AccountRoles.ADMIN)
                {
                    accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Role == AccountRoles.USER);
                }
            }

            if (pagination.Filter.isMuted)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Status.CommentMutedUntil >= DateTime.Now || x.Status.PostMutedUntil >= DateTime.Now);
            }

            accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Role != AccountRoles.ADMIN);

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
            account.Id = newAccount.Uid;

            return account;
        }

        public async Task SetClaimWhenSignUp(Account account)
        {
            await FirebaseService.SetRoleClaim(account.Uid, AccountRoles.USER);
            await FirebaseService.SetNameClaim(account.Uid, account.Name);
            await FirebaseService.SetAvatarClaim(account.Uid, account.Avatar);
            await FirebaseService.SetInitiatedClaim(account.Uid);
        }

        public async Task SetClaimWhenUpdateProfile(Account account)
        {
            await FirebaseService.SetNameClaim(account.Uid, account.Name);
            await FirebaseService.SetAvatarClaim(account.Uid, account.Avatar);
        }

        public FilterDefinition<Account> AccountFilterId(string userId)
        {
            var accountFilter = Builders<Account>.Filter.Empty;
            return accountFilter;
        }

        public async Task<Account?> GetAccountById(string userId)
        {
            var accountFilter = AccountFilterId(userId);
            var accountsFromRepo = await _accountRepo.FindOneAsync(filter: accountFilter);
            return accountsFromRepo;
        }

        public async Task<(bool status, string message)> UpdateAccountProfile(string uid, AccountProfileUpdateDto accountProfileUpdateDto)
        {
            using var session = await _accountRepo.StartSessionAsync();
            try
            {
                session.StartTransaction();

                // To check whether account exist or not.
                var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Uid", uid));

                // Account not found
                if (accountFromRepo is null)
                {
                    return (false, ResponseMessage.ACCOUNT_NOT_FOUND);
                }

                // Update properties
                _mapper.Map(accountProfileUpdateDto, accountFromRepo);

                // Upload new avatar
                if (accountProfileUpdateDto.AvatarFile is not null)
                {
                    // Check file extension
                    (var isImageFile, var imageCheckMessage) = FileExtension.CheckImageExtension(accountProfileUpdateDto.AvatarFile);
                    if (isImageFile is false)
                    {
                        return (false, imageCheckMessage!);
                    }

                    var fileExtension = FileExtension.GetFileExtension(accountProfileUpdateDto.AvatarFile);
                    var filename = $"{uid}{fileExtension}";

                    // Delete old file, if possible
                    await _s3Service.DeleteFileAsync(
                        _configuration.GetValue<string>("S3:ResourcesBucket"),
                        S3Config.IMAGES_FOLDER,
                        filename
                    );

                    // Upload new avatar
                    (bool avatarUploadStatus, string avatarUrl) = await _fileStorage.UploadImage(
                        filename,
                        accountProfileUpdateDto.AvatarFile.OpenReadStream(),
                        accountProfileUpdateDto.AvatarFile.ContentType
                    );

                    accountFromRepo.Avatar = avatarUrl;
                }

                var rs = await _accountRepo.ReplaceOneAsync(accountFromRepo.Id, accountFromRepo);

                if (rs is true)
                {
                    // Set Firebase new claim
                    await SetClaimWhenUpdateProfile(accountFromRepo);
                }

                await session.CommitTransactionAsync();

                return (
                    rs,
                    rs is false ? ResponseMessage.ACCOUNT_PROFILE_UPDATE_FAIL
                                : ResponseMessage.ACCOUNT_PROFILE_UPDATE_SUCCESS
                );
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                await session.AbortTransactionAsync();
                return (false, ResponseMessage.ACCOUNT_PROFILE_UPDATE_FAIL);
            }
        }

        public async Task<Account?> AccountGetAccountByUid(string uid)
        {
            var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Uid", uid));

            return accountFromRepo;
        }
    }
}