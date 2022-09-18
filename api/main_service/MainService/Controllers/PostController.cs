using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MainService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IPostRepo _postRepo;


        public PostController(IMapper mapper, IPostRepo postRepo)
        {
            _mapper = mapper;
            _postRepo = postRepo;
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto>> AddPost([FromBody] PostCreateDto newPost)
        {
            var post = _mapper.Map<Post>(newPost);
            var rs = await _postRepo.AddOneAsync(post);
            return Ok(new ResponseDto(200, "Add new post successfully"));
        }

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<PostReadDto>>> ListAllPosts()
        {
            BsonDocument lookup = new BsonDocument{
                { "from", "comment" },
                { "localField", "_id" },
                { "foreignField", "PostId" },
                { "as", "Comments" }
            };

            BsonDocument sort = new BsonDocument{
                { "CreatedAt", -1 }
            };

            var rs = await _postRepo.FindManyAsync(lookup: lookup, sort: sort);

            return Ok(rs.entities);
        }

        // [HttpDelete("{id}")]
        // public async Task<ActionResult<ResponseDto>> DeletePost()
        // {
        //     return Ok();
        // }

        // [HttpPut("")]
        // public async Task<ActionResult<ResponseDto>> UpdatePost()
        // {
        //     return Ok();
        // }

        // [HttpPut("vote/{id}")]
        // public async Task<ActionResult<ResponseDto>> UpDownVotePost()
        // {
        //     return Ok();
        // }
    }
}