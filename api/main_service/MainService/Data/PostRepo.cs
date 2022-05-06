using MainService.Models;

namespace MainService.Data
{
    public interface IPostRepo : IRepository<Post> { }

    public class PostRepo : Repository<Post>, IPostRepo
    {
        public PostRepo(IMongoContext mongoContext) : base(mongoContext) { }

    }
}