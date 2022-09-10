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

        BsonDocument SortFilter(string Sort);

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
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Role == "Moderator");
            }

            if (pagination.Filter.isMuted)
            {
                accountFilter = accountFilter & Builders<Account>.Filter.Where(x => x.Status.CommentMutedUntil >= DateTime.Now || x.Status.PostMutedUntil >= DateTime.Now);
            }

            return accountFilter;
        }
        public BsonDocument SortFilter(string Sort)
        {
            string sortType = "";

            int adesc = 1;

            switch (Sort)
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
    }
}