using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Filters;
using MainService.Logic;
using MainService.Models;
using MainService.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class CommentsController : ControllerBase
	{
		private readonly IMapper _mapper;
		private readonly IPostRepo _postRepo;
		private readonly IAccountRepo _accountRepo;
		private readonly ICommentRepo _commentRepo;
		private readonly ICommentLogic _commentLogic;
		private readonly IAccountLogic _accountLogic;

		public CommentsController(IMapper mapper, IAccountRepo accountRepo, IPostRepo postRepo, ICommentRepo commentRepo,
			ICommentLogic commentLogic, IAccountLogic accountLogic)
		{
			_mapper = mapper;
			_commentRepo = commentRepo;
			_commentLogic = commentLogic;
			_postRepo = postRepo;
			_accountRepo = accountRepo;
			_accountLogic = accountLogic;
		}

		[Authorize]
		[HttpPost]
		public async Task<ActionResult<ResponseDto>> AddComment([FromForm] CommentCreateDto newComment)
		{
			if (newComment.PostId is null && newComment.CommentId is null)
			{
				return BadRequest(new ResponseDto(400, ResponseMessage.COMMENT_CREATE_FAIL_NO_IDS));
			}

			if (newComment.Content is null && newComment.Media is null)
			{
				return BadRequest(new ResponseDto(400, "Content or Media is required"));
			}

			var comment = _mapper.Map<Comment>(newComment);

			var userId = "";

			// Get User Id
			try
			{
				userId = User.FindFirst(JwtTokenPayload.USER_ID)!.Value;

				// To check whether account exist or not.
				var accountFromRepo = await _accountRepo.FindOneAsync(Builders<Account>.Filter.Eq("Uid", userId));

				// Account not found
				if (accountFromRepo is null)
				{
					return NotFound(new ResponseDto(404, ResponseMessage.ACCOUNT_NOT_FOUND));
				}
			}
			catch (Exception)
			{
				return NotFound(new ResponseDto(404, ResponseMessage.ACCOUNT_NOT_FOUND));
			}

			comment.UserId = userId;

			// Add comment into the repo first
			var rs = await _commentRepo.AddOneAsync(comment);

			if (newComment.PostId != null)
			{// if that comment is the 1st level comment
			 // Update Post comment ids
				var commentLogicRs = await _commentLogic.UpdatePostComment(newComment.PostId, rs);

				if (commentLogicRs == false)
				{
					return BadRequest(new ResponseDto(400, ResponseMessage.COMMENT_CREATE_FAIL));
				}
			}

			if (newComment.CommentId != null)
			{
				// Update comment's child comment ids
				var commentFromRepo = await _commentLogic.GetCommentById(newComment.CommentId);

				if (commentFromRepo.Comments == null)
				{
					commentFromRepo.Comments = new List<ObjectId>();
					// commentFromRepo.Comments = new List<string>();
				}
				commentFromRepo.Comments.Add(new ObjectId(comment.Id));
				// commentFromRepo.Comments.Add(comment.Id);

				var commentLogicRs = await _commentLogic.UpdateComment(newComment.CommentId, commentFromRepo);

				if (commentLogicRs == false)
				{
					return BadRequest(new ResponseDto(400, ResponseMessage.COMMENT_CREATE_FAIL));
				}
			}

			var isMediaExist = newComment.Media != null;
			if (isMediaExist)
			{

				(var isMp3File, var songCheckMessage) = FileExtension.CheckMp3Extension(newComment.Media!);
				(var isImageFile, var imageCheckMessage) = FileExtension.CheckImageExtension(newComment.Media!);
				(var isVideoFile, var videoCheckMessage) = FileExtension.CheckVideoExtension(newComment.Media!);

				if (!isMp3File && !isImageFile && !isVideoFile)
				{
					return BadRequest(new ResponseDto(400, ResponseMessage.COMMENT_CREATE_MEDIA_FAIL));
				}
				var mediaType = "";
				var folderUpload = "";
				if (isMp3File)
				{
					folderUpload = S3Config.AUDIOS_FOLDER;
					mediaType = "audio";
				}
				else if (isImageFile)
				{
					folderUpload = S3Config.IMAGES_FOLDER;
					mediaType = "image";
				}
				else
				{// is video
					folderUpload = S3Config.VIDEOS_FOLDER;
					mediaType = "video";
				}
				comment.Media = new Media()
				{
					Id = ObjectId.GenerateNewId().ToString(),
				};
				var commentUploadStatus = await _commentLogic.UploadNewComment(
				comment,
				newComment.Media!.OpenReadStream(),
				newComment.Media.ContentType,
				FileExtension.GetFileExtension(newComment.Media),
				folderUpload,
				mediaType
				);
			}
			return Ok(new ResponseDto(200, ResponseMessage.COMMENT_CREATE_SUCCESS));
		}

		// [Authorize]
		[HttpPost("filter")]
		public async Task<ActionResult<PaginationResDto<CommentReadDto>>> GetComments(PaginationReqDto<CommentFilterDto> pagination)
		{
			if (pagination.Filter is null)
			{
				return BadRequest(new ResponseDto
				{
					Status = 400,
					Message = $"filter.objectId is required!"
				});
			}

			// Pagination formula
			var skipPage = (pagination.Page - 1) * pagination.Size;
			var sort = _commentLogic.SortFilter(pagination.Filter.Sort);

			try
			{
				(var total, var comments) = await _commentLogic.GetComments(pagination.Filter.ObjectId!, pagination.Filter.IsPostChild, sort, pagination.Size, skipPage);

				var commentDtos = _mapper.Map<IEnumerable<CommentReadDto>>(comments);

				return Ok(new PaginationResDto<CommentReadDto>((int)total, commentDtos));
			}
			catch
			{
				return BadRequest(new ResponseDto
				{
					Status = 400,
					Message = $"{pagination.Filter.ObjectId} is not exists"
				});
			}
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<CommentReadDto>> GetCommentById(string id)
		{
			var comment = await _commentLogic.GetCommentById(id);

			if (comment is null)
			{
				return BadRequest(new ResponseDto(404));
			}
			return _mapper.Map<CommentReadDto>(comment);
		}

		[Authorize]
		[HttpDelete("{id}")]
		[AuthorizeResource(ResourceType = ResourceType.Comment, IdField = "id")]
		public async Task<ActionResult<ResponseDto>> DeleteComment(string id)
		{
			var rs = await _commentLogic.DeleteComment(id);

			if (rs is false)
			{
				return BadRequest(new ResponseDto(400, ResponseMessage.COMMENT_DELETE_FAIL));
			}

			return Ok(new ResponseDto(200, ResponseMessage.COMMENT_DELETE_SUCCESS));
		}
	}
}
