using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MainService.Logic;

public interface IPostLogic
{
    Task<Post?> GetPostById(string id);

    Task<bool> VotePost(string userId, string voteId, bool isUpVote);

	Task<VoteResponeDto> PostVoteCount(string postId);

	Task<int> SavePost(string postId, string userId);
}

public class PostLogic : IPostLogic
{
    private readonly IPostRepo _postRepo;

	private readonly IAccountRepo _accountRepo;
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

    public PostLogic(IPostRepo postRepo, IAccountRepo accountRepo)
    {
        _postRepo = postRepo;
		_accountRepo = accountRepo;
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

    public async Task<VoteResponeDto> PostVoteCount(string postId)
    {
		var filter = Builders<Post>.Filter.Eq(p => p.Id, postId);

		var post = await _postRepo.FindOneAsync(filter: filter);

		VoteResponeDto res = new VoteResponeDto();

		res.UpVote = post.UpvotedBy;

		res.DownVote = post.DownvotedBy;

		return res;
	}

    public async Task<bool> VotePost(string userId, string postId, bool isUpVote)
    {

        var filter = Builders<Post>.Filter.Eq(p => p.Id, postId);

        var post = await _postRepo.FindOneAsync(filter: filter);

        if(post.UpvotedBy == null)
		{
			post.UpvotedBy = new List<string>();
		}

		if(post.DownvotedBy == null)
		{
			post.DownvotedBy = new List<string>();
		}

        if (post.UpvotedBy.Contains(userId))
        {

            post.UpvotedBy.Remove(userId);

            if (!isUpVote)
            {
                post.DownvotedBy.Add(userId);
            }

			await _postRepo.ReplaceOneAsync(postId, post);

			return true;

        }
        else if (post.DownvotedBy.Contains(userId))
        {

            post.DownvotedBy.Remove(userId);

            if (isUpVote)
            {
                post.UpvotedBy.Add(userId);
            }

            await _postRepo.ReplaceOneAsync(postId, post);

            return true;

        } else {

            if (isUpVote)
            {

                post.UpvotedBy.Add(userId);

            } else {

                post.DownvotedBy.Add(userId);

            }

            await _postRepo.ReplaceOneAsync(postId, post);

            return true;
        }
    }

    public async Task<int> SavePost(string postId, string userId)
    {

		var userFilter = Builders<Account>.Filter.Eq(u => u.Id, userId);

		var user = await _accountRepo.FindOneAsync(userFilter);

        if (user.SavedPosts == null)
        {
			user.SavedPosts = new List<ObjectId>();
		}

		if (user.SavedPosts.Contains(new ObjectId(postId)))
        {
			return 0;
		} else
        {
			user.SavedPosts.Add(new ObjectId(postId));
		}

		await _accountRepo.ReplaceOneAsync(userId, user);

		return 1;

	}
}
