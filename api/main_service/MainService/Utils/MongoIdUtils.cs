using MongoDB.Bson;

namespace MainService.Utils;

public static class MongoIdUtils
{
    public static ICollection<ObjectId>? ConvertStringArrToObjectIdArr(ICollection<string> src)
    {
        var list = new List<ObjectId>();

        foreach (var item in src)
        {
            var mongoId = new ObjectId(item);
            list.Add(mongoId);
        }

        return list;
    }
}
