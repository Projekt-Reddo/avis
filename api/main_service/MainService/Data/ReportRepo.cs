using MainService.Models;

namespace MainService.Data
{
    public interface IReportRepo : IRepository<Report> { }

    public class ReportRepo : Repository<Report>, IReportRepo
    {
        public ReportRepo(IMongoContext mongoContext) : base(mongoContext) { }
    }
}