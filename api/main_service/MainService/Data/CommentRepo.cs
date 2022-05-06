using MainService.Models;

namespace MainService.Data
{
    public interface ICommentRepo : IRepository<Comment> { }

    public class CommentRepo : Repository<Comment>, ICommentRepo
    {
        public CommentRepo(IMongoContext mongoContext) : base(mongoContext) { }

    }

}