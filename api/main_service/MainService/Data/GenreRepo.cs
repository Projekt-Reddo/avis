using MainService.Models;

namespace MainService.Data;

public interface IGenreRepo : IRepository<Genre> { }

public class GenreRepo : Repository<Genre>, IGenreRepo
{
    public GenreRepo(IMongoContext context) : base(context)
    {
    }
}
