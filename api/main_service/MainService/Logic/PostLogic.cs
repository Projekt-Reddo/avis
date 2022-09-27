using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Principal;
using static Constants;

namespace MainService.Logic
{
    public interface IPostLogic
    {
        FilterDefinition<Post> VotePostFilter(VotePostDto votePost);
        Task<bool> UpDownVoteCheck(VotePostDto votePost);
        Task<bool> Vote(VotePostDto votePost);
        Task<bool> UnVote(VotePostDto votePost);
    }
    public class PostLogic : IPostLogic
    {
        private readonly IPostRepo _postRepo;

        public PostLogic(IPostRepo postRepo)
        {
            _postRepo = postRepo;
        }

        public async Task<bool> UpDownVoteCheck(VotePostDto votePost)
        {

            var postUpFilter =  Builders<Post>.Filter.Where(p => p.UpvotedBy.Contains(ObjectId.Parse(votePost.UserId)) && p.Id == votePost.PostId);

            var postDownFilter =  Builders<Post>.Filter.Where(p => p.DownvotedBy.Contains(ObjectId.Parse(votePost.UserId)) && p.Id == votePost.PostId);

            if (await _postRepo.FindOneAsync(postUpFilter) != null || await _postRepo.FindOneAsync(postDownFilter) != null)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public FilterDefinition<Post> VotePostFilter(VotePostDto votePost)
        {
            var postFilter = Builders<Post>.Filter.Empty;

            postFilter = postFilter & Builders<Post>.Filter.Where(p => p.Id == votePost.PostId);

            return postFilter;
        }

        public async Task<bool> Vote(VotePostDto votePost)
        {
            var postUpFilter =  Builders<Post>.Filter.Where(p => p.Id == votePost.PostId);

            var postGet = await _postRepo.FindOneAsync(postUpFilter);

            if (votePost.UpVote)
            {
                var upVotedIds = new List<ObjectId>();
                if (postGet.UpvotedBy != null)
                {
                    upVotedIds = postGet.UpvotedBy.ToList();
                }

                upVotedIds.Add(ObjectId.Parse(votePost.UserId));

                postGet.UpvotedBy = upVotedIds;
            } else
            {
                var downVotedIds = new List<ObjectId>();
                if (postGet.UpvotedBy != null)
                {
                    downVotedIds = postGet.DownvotedBy.ToList();
                }

                downVotedIds.Add(ObjectId.Parse(votePost.UserId));

                postGet.UpvotedBy = downVotedIds;
            }

            var rs = await _postRepo.ReplaceOneAsync(postGet.Id, postGet);

            return rs;
        }
        public async Task<bool> UnVote(VotePostDto votePost)
        {
            var postUpFilter =  Builders<Post>.Filter.Where(p => p.Id == votePost.PostId);

            var postGet = await _postRepo.FindOneAsync(postUpFilter);

            if (votePost.UpVote)
            {
                var upVotedIds = new List<ObjectId>();
                if (postGet.UpvotedBy != null)
                {
                    upVotedIds = postGet.UpvotedBy.ToList();
                }

                upVotedIds.Remove(ObjectId.Parse(votePost.UserId));

                postGet.UpvotedBy = upVotedIds;
            } else
            {
                var downVotedIds = new List<ObjectId>();
                if (postGet.UpvotedBy != null)
                {
                    downVotedIds = postGet.DownvotedBy.ToList();
                }

                downVotedIds.Remove(ObjectId.Parse(votePost.UserId));

                postGet.UpvotedBy = downVotedIds;
            }

            var rs = await _postRepo.ReplaceOneAsync(postGet.Id, postGet);

            return rs;
        }
    }
}