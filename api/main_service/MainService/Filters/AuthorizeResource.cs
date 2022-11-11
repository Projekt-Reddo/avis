using System.Collections.Immutable;
using System.Security.Claims;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MongoDB.Driver;
using static Constants;

namespace MainService.Filters;

public class AuthorizeResource : ActionFilterAttribute
{
	public ResourceType ResourceType { get; set; }
	public string IdField { get; set; } = "id";

	public override void OnActionExecuting(ActionExecutingContext context)
	{
		try
		{
			var userId = (context.HttpContext.User.Identity as ClaimsIdentity)!.Claims.Where(c => c.Type == JwtTokenPayload.USER_ID).FirstOrDefault()!.Value;
			var resourceId = context.ActionArguments[IdField] as string;

			switch (ResourceType)
			{
				case ResourceType.Post:
					var _postRepo = (IPostRepo)context.HttpContext.RequestServices.GetService(typeof(IPostRepo))!;
					if (_postRepo is null)
					{
						throw new Exception("Cannot get required services for checking resource authorization");
					}

					var post = _postRepo.FindOneAsync(Builders<Post>.Filter.Eq(x => x.Id, resourceId)).Result;
					if (post is null)
					{
						context.Result = new NotFoundObjectResult(new ResponseDto(404));
					}

					if (post!.UserId != userId)
					{
						context.Result = new NotFoundObjectResult(new ResponseDto(403));
					}
					break;

				case ResourceType.Comment:
					var _commentRepo = (ICommentRepo)context.HttpContext.RequestServices.GetService(typeof(ICommentRepo))!;
					if (_commentRepo is null)
					{
						throw new Exception("Cannot get required services for checking resource authorization");
					}

					var comment = _commentRepo.FindOneAsync(Builders<Comment>.Filter.Eq(x => x.Id, resourceId)).Result;
					if (comment is null)
					{
						context.Result = new NotFoundObjectResult(new ResponseDto(404));
					}

					if (comment!.UserId != userId)
					{
						context.Result = new NotFoundObjectResult(new ResponseDto(403));
					}
					break;

				default:
					return;
			}
		}
		catch (Exception e)
		{
			context.Result = new BadRequestObjectResult(new ResponseDto(400, e.Message));
			return;
		}

	}
}
