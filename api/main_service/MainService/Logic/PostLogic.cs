using MainService.Data;
using MainService.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MainService.Logic;

public interface IPostLogic
{
    Task<Post?> GetPostById(string id);

    Task<bool> VotePost(string userId, string voteId, bool isUpVote);
}

public class PostLogic : IPostLogic
{
    private readonly IPostRepo _postRepo;
    private readonly List<BsonDocument> userLookUp = new List<BsonDocument>(){
        new BsonDocument
        {
            {
                "$lookup", new BsonDocument{
                    { "from", "account" },
                    { "localField", "UserId" },
                    { "foreignField", "_id" },
                    { "as", "User" }
                }
            }
        },
        new BsonDocument {
            { "$unwind", "$User" }
        }
    };

    public PostLogic(IPostRepo postRepo)
    {
        _postRepo = postRepo;
    }

    public async Task<Post?> GetPostById(string id)
    {
        var filter = Builders<Post>.Filter.Eq(x => x.Id, id)
                     & Builders<Post>.Filter.Not(Builders<Post>.Filter.Eq(x => x.IsDeleted, true));

        IEnumerable<BsonDocument> stages = new List<BsonDocument>();

        stages = stages.Concat(userLookUp);

        var post = await _postRepo.FindOneAsync(filter: filter, stages: stages);
        return post;
    }

    public async Task<bool> VotePost(string userId, string postId, bool isUpVote)
    {

        var filter = Builders<Post>.Filter.Eq(p => p.Id, postId);

        var post = await _postRepo.FindOneAsync(filter: filter);

        if (post.UpvotedBy.Contains(userId))
        {

            post.UpvotedBy.Remove(userId);

            if (!isUpVote)
            {
                post.DownvotedBy.Add(userId);
            }

            return true;
        }
        else if (post.DownvotedBy.Contains(userId))
        {

            post.DownvotedBy.Remove(userId);

            if (isUpVote)
            {
                post.UpvotedBy.Add(userId);
            }

            return true;
        } else {

            if (isUpVote)
            {

                post.UpvotedBy.Add(userId);

            } else {

                post.DownvotedBy.Add(userId);

            }

            return true;
        }
    }
}
