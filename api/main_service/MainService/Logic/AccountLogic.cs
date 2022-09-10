using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Logic
{
    public interface IAccountLogic
    {
        FilterDefinition<Account> AccountFilter(PaginationReqDto<AccountFilterDto> pagination);
    }
    public class AccountLogic : IAccountLogic
    {
        private readonly IS3Service _s3Service;
        private readonly IConfiguration _configuration;
        private IAccountRepo _accountRepo;
        private IPostRepo _postRepo;
        private IReportRepo _reportRepo;

        public AccountLogic(IS3Service s3Service, IConfiguration configuration, IAccountRepo accountRepo, IPostRepo postRepo, IReportRepo reportRepo)
        {
            _s3Service = s3Service;
            _configuration = configuration;
            _accountRepo = accountRepo;
            _postRepo = postRepo;
            _reportRepo = reportRepo;
        }

        public FilterDefinition<Account> AccountFilter(PaginationReqDto<AccountFilterDto> pagination)
        {
            var accountFilter = Builders<Account>.Filter.Empty;

            /// Name Filter
            if (pagination.Filter.Name != null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Regex("Name", new BsonRegularExpression(pagination.Filter.Name, "i"));
            }
            // Joined Day Filter
            if (pagination.Filter.JoinedStart == null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Gte(x => x.CreatedAt, DateTime.MinValue);
            } else
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Gte(x => x.CreatedAt, pagination.Filter.JoinedStart);
            }
            // Joined End Filter
            if (pagination.Filter.JoinedEnd == null)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Lte(x => x.CreatedAt, DateTime.MaxValue);
            } else
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Lte(x => x.CreatedAt, pagination.Filter.JoinedEnd);
            }

            // Banned Filter

            if (pagination.Filter.isBanned)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Status.IsBanned == true);
            }

            // Moderator Filter

            if (pagination.Filter.isModerator)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Role == "Moderator");
            }

            // Muted Filter

            if (pagination.Filter.isMuted)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Status.CommentMutedUntil >= DateTime.Now || x.Status.PostMutedUntil >= DateTime.Now);
            }

            // Return Filter

            return accountFilter;
        }
    }
}