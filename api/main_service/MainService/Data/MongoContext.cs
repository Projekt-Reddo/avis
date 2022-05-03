using MongoDB.Driver;

namespace MainService.Data
{
    public interface IMongoContext
    {
        IMongoDatabase Database { get; }
    }

    public class MongoContext : IMongoContext
    {
        public IMongoDatabase Database { get; }

        public MongoContext(MongoDbSetting mongoDbSetting)
        {
            var client = new MongoClient(mongoDbSetting.ConnectionString);
            Database = client.GetDatabase(mongoDbSetting.Database);
        }
    }

    public class MongoDbSetting
    {
        public string ConnectionString { get; set; } = null!;
        public string Database { get; set; } = null!;
    }
}