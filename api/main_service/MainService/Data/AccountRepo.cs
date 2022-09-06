using MainService.Models;

namespace MainService.Data
{
    public interface IAccountRepo : IRepository<Account> { }

    public class AccountRepo : Repository<Account>, IAccountRepo
    {
        public AccountRepo(IMongoContext mongoContext) : base(mongoContext) { }
    }
}