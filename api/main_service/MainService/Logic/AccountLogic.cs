using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Logic
{
    public interface IAccountLogic
    {
        FilterDefinition<Account> AccountFilter(PaginationReqDto<AccountFilterDto> pagination,string role);

        BsonDocument SortFilter(string Sort);

        Task<Account> SetupNewAccount(AccountCreateDto newAccount);

        Task SetClaimWhenSignUp(Account account);

		Task SetClaimWhenUpdateProfile(Account account);

		Account SetAccountDefaultValues(AccountCreateDto newAccount);

        FilterDefinition<Account> AccountFilterId(string userId);

        Task<Account?> GetAccountById(string userId);

        Task<Account?> AccountGetAccountByUid(string uid);

        Task<(bool status, string message, Account? data)> UpdateAccountProfile(string uid, AccountProfileUpdateDto accountProfileUpdateDto);
		Task<(bool status, string message, Account? data)> Promote(string uid);
		Task<(bool status, string message)> PromoteMany(AccountUidList accountPromoteList);
		Task<(bool status, string message, Account? data)> Ban(string uid);
		Task<(bool status, string message)> BanMany(AccountUidList accountPromoteList);
	}
	public class AccountLogic : IAccountLogic
	{
		private readonly IS3Service _s3Service;
		private readonly IConfiguration _configuration;
		private readonly IAccountRepo _accountRepo;
		private readonly IPostRepo _postRepo;
		private readonly IReportRepo _reportRepo;
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
				}
				else
				{
					accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Role == AccountRoles.MODERATOR);
				}
			}
			else
			{
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

		public async Task SetClaimWhenSignUp(Account account) => await FirebaseService.SetClaims(account);

		public async Task SetClaimWhenUpdateProfile(Account account) => await FirebaseService.SetClaims(account);


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

		public async Task<(bool status, string message, Account? data)> UpdateAccountProfile(string uid, AccountProfileUpdateDto accountProfileUpdateDto)
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
					return (false, ResponseMessage.ACCOUNT_NOT_FOUND, null);
				}

				// Update properties
				_mapper.Map(accountProfileUpdateDto, accountFromRepo);

				var update = Builders<Account>.Update.Set(x => x.Name, accountProfileUpdateDto.Name);

				// Upload new avatar
				if (accountProfileUpdateDto.AvatarFile is not null)
				{
					// Check file extension
					(var isImageFile, var imageCheckMessage) = FileExtension.CheckImageExtension(accountProfileUpdateDto.AvatarFile);
					if (isImageFile is false)
					{
						return (false, imageCheckMessage!, null);
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
					update = update.Set(x => x.Avatar, avatarUrl);
				}

				var filter = Builders<Account>.Filter.Eq(x => x.Uid, uid);
				var rs = await _accountRepo.UpdateOneAsync(session, filter, update);

				await SetClaimWhenUpdateProfile(accountFromRepo);
				await session.CommitTransactionAsync();

				return (rs, ResponseMessage.ACCOUNT_PROFILE_UPDATE_SUCCESS, accountFromRepo);
			}
			catch (Exception e)
			{
				_logger.LogError(e.Message);
				await session.AbortTransactionAsync();
				return (false, ResponseMessage.ACCOUNT_PROFILE_UPDATE_FAIL, null);
			}
		}

		public async Task<Account?> AccountGetAccountByUid(string uid)
		{
			var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Uid", uid));

			return accountFromRepo;
		}

		public async Task<(bool status, string message, Account? data)> Promote(string uid)
		{
			var filterUid = Builders<Account>.Filter.Eq(x => x.Uid, uid);

			// To check whether account exist or not.
			var accountFromRepo = await _accountRepo.FindOneAsync(
				filterUid &
				Builders<Account>.Filter.Not(Builders<Account>.Filter.Eq(x => x.Role, AccountRoles.ADMIN))
			);

			// Account not found
			if (accountFromRepo is null)
			{
				return (false, ResponseMessage.ACCOUNT_NOT_FOUND, null);
			}

			var update = Builders<Account>.Update.Set(x => x.Role, AccountRoles.MODERATOR);
			accountFromRepo.Role = AccountRoles.MODERATOR;
			var responseMessage = ResponseMessage.ACCOUNT_PROMOTED;

			// Switch roles
			if (accountFromRepo.Role == AccountRoles.MODERATOR)
			{
				update = Builders<Account>.Update.Set(x => x.Role, AccountRoles.USER);
				accountFromRepo.Role = AccountRoles.USER;
				responseMessage = ResponseMessage.ACCOUNT_DEMOTED;
			}

			var rs = await _accountRepo.UpdateOneAsync(filterUid, update);

			await SetClaimWhenUpdateProfile(accountFromRepo);

			return (rs, responseMessage, accountFromRepo);
		}

		public async Task<(bool status, string message)> PromoteMany(AccountUidList accountPromoteList)
		{
			ICollection<string> failedAccountUids = new List<string>();
			foreach (string uid in accountPromoteList.Uids)
			{
				(bool status, string message, Account? data) = await Promote(uid);

				if (status is false)
				{
					failedAccountUids.Add(uid);
				}
			}

			if (failedAccountUids.Count == accountPromoteList.Uids.Count())
			{
				return (false, "Could not update any account!");
			}

			if (failedAccountUids.Any())
				return (true, $"Error occured with those Uids: {String.Join(", ", failedAccountUids)}");

			return (true, ResponseMessage.ACCOUNT_ROLE_UPDATE_SUCCESS);
		}

		public async Task<(bool status, string message, Account? data)> Ban(string uid)
		{
			var filterUid = Builders<Account>.Filter.Eq(x => x.Uid, uid);

			// To check whether account exist or not.
			var accountFromRepo = await _accountRepo.FindOneAsync(
				filterUid &
				Builders<Account>.Filter.Not(Builders<Account>.Filter.Eq(x => x.Role, AccountRoles.ADMIN))
			);

			// Account not found
			if (accountFromRepo is null)
			{
				return (false, ResponseMessage.ACCOUNT_NOT_FOUND, null);
			}

			// Get or create new AccountStatus
			var accountStatus = GetAccountStatus(accountFromRepo);

			// Switch ban state
			accountStatus.IsBanned = !accountStatus.IsBanned;

			// Update db
			var update = Builders<Account>.Update.Set(x => x.Status, accountStatus);
			var rs = await _accountRepo.UpdateOneAsync(filterUid, update);

			accountFromRepo.Status = accountStatus;

			// Set Firebase claim
			await SetClaimWhenUpdateProfile(accountFromRepo);

			// Res
			string responseMessage = "";

			if (accountStatus.IsBanned is true)
			{
				responseMessage = ResponseMessage.ACCOUNT_BANNED;
			}
			else
			{
				responseMessage = ResponseMessage.ACCOUNT_UNBANNED;
			}

			return (rs, responseMessage, accountFromRepo);
		}

		public async Task<(bool status, string message)> BanMany(AccountUidList accountPromoteList)
		{
			ICollection<string> failedAccountUids = new List<string>();
			foreach (string uid in accountPromoteList.Uids)
			{
				(bool status, string message, Account? data) = await Ban(uid);

				if (status is false)
				{
					failedAccountUids.Add(uid);
				}
			}

			if (failedAccountUids.Count == accountPromoteList.Uids.Count())
			{
				return (false, "Could not update any account!");
			}

			if (failedAccountUids.Any())
				return (true, $"Error occured with those Uids: {String.Join(", ", failedAccountUids)}");

			return (true, ResponseMessage.ACCOUNT_STATUS_UPDATE_SUCCESS);
		}

		private AccountStatus GetAccountStatus(Account accountFromRepo)
		{
			if (accountFromRepo.Status is null)
			{
				return new AccountStatus();
			}

			return accountFromRepo.Status;
		}
	}
}
