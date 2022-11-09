using MainService.Models;

namespace MainService.Data
{
	public interface INotifyRepo : IRepository<Notify> { }

	public class NotifyRepo : Repository<Notify>, INotifyRepo
	{
		public NotifyRepo(IMongoContext mongoContext) : base(mongoContext) { }

	}
}