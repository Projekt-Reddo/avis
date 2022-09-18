using MainService.Models;

namespace MainService.Data
{
    public interface IArtistRepo : IRepository<Artist>
    {
    }

    public class ArtistRepo : Repository<Artist>, IArtistRepo
    {
        public ArtistRepo(IMongoContext context) : base(context)
        {
        }
    }
}