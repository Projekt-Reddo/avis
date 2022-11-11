using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Logic;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VoteController : ControllerBase
{
	private readonly IMapper _mapper;
	private readonly IPostLogic _postLogic;
	private readonly ICommentLogic _commentLogic;
	public VoteController
	(
		IMapper mapper,
		IPostLogic postLogic,
		ICommentLogic commentLogic)
	{
		_mapper = mapper;
		_postLogic = postLogic;
		_commentLogic = commentLogic;
	}

	[Authorize]
	[HttpPut]
	public async Task<ActionResult<VoteResponeDto>> Vote(VoteDto voteDto)
	{
		if (voteDto.isVotePost)
		{
			var userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value;

			var rs = await _postLogic.VotePost(userId, voteDto.VoteId, voteDto.isUpvote);

			if (!rs)
			{
				return BadRequest(new ResponseDto(404, ResponseMessage.POST_VOTE_FAIL));
			}

			var count = await _postLogic.PostVoteCount(voteDto.VoteId);

			return Ok(count);

		}
		else
		{
			var userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value;

			var rs = await _commentLogic.VoteComment(userId, voteDto.VoteId, voteDto.isUpvote);

			if (!rs)
			{
				return BadRequest(new ResponseDto(404, ResponseMessage.COMMENT_VOTE_FAIL));
			}

            var count = await _commentLogic.CommentVoteCount(voteDto.VoteId);

			return Ok(count);
		}
	}

}