using MainService.Models;

namespace MainService.Data;

public interface ISongRepo : IRepository<Song> { }

public class SongRepo : Repository<Song>, ISongRepo
{
    public SongRepo(IMongoContext mongoContext) : base(mongoContext) { }
}