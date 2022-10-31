using System.Collections.Immutable;
using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Utils;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Logic;

public interface IReportLogic
{
	Task<ReportLogicResponse> PostReport(ReportCreateDto reportDto);
	Task<ReportLogicResponse> CommentReport(ReportCreateDto reportDto);
	Task<PaginationResDto<ReportReadDto>> List(PaginationReqDto<ReportFilterDto> pagination);
	Task<Report?> GetById(string id);
	Task<ReportLogicResponse> ConfirmReport(string id, ReportConfirmDto confirmDto, string accountId);
}

public class ReportLogic : IReportLogic
{
	private readonly IReportRepo _reportRepo;
	private readonly IPostLogic _postLogic;
	private readonly ICommentLogic _commentLogic;
	private readonly IMapper _mapper;
	private readonly ILogger<ReportLogic> _logger;
	private readonly List<BsonDocument> userLookUpStages = new List<BsonDocument>(){
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

	public ReportLogic(
		IReportRepo reportRepo,
		IPostLogic postLogic,
		ICommentLogic commentLogic,
		IMapper mapper,
		ILogger<ReportLogic> logger
	)
	{
		_reportRepo = reportRepo;
		_postLogic = postLogic;
		_commentLogic = commentLogic;
		_mapper = mapper;
		_logger = logger;
	}

	public async Task<ReportLogicResponse> PostReport(ReportCreateDto reportDto)
	{
		try
		{
			var post = await _postLogic.GetPostById(reportDto.PostId!);
			if (post is null)
			{
				return new ReportLogicResponse
				{
					StatusCode = 404,
					Status = false,
					Message = ResponseMessage.POST_NOT_FOUND
				};
			}

			var report = _mapper.Map<Report>(reportDto);
			report.Post = post;

			var rs = await _reportRepo.AddOneAsync(report);

			return new ReportLogicResponse
			{
				StatusCode = 200,
				Status = true,
				Message = ResponseMessage.REPORT_CREATE_SUCCESS
			};
		}
		catch (Exception e)
		{
			_logger.LogError(e.Message);
			return new ReportLogicResponse
			{
				StatusCode = 500,
				Status = false,
				Message = e.Message
			};
		}
	}

	public async Task<ReportLogicResponse> CommentReport(ReportCreateDto reportDto)
	{
		try
		{
			var comment = await _commentLogic.GetCommentById(reportDto.CommentId!);
			if (comment is null)
			{
				return new ReportLogicResponse
				{
					StatusCode = 404,
					Status = false,
					Message = ResponseMessage.COMMENT_NOT_FOUND
				};
			}

			var report = _mapper.Map<Report>(reportDto);
			report.Comment = comment;

			var rs = await _reportRepo.AddOneAsync(report);

			return new ReportLogicResponse
			{
				StatusCode = 200,
				Status = true,
				Message = ResponseMessage.REPORT_CREATE_SUCCESS
			};
		}
		catch (Exception e)
		{
			_logger.LogError(e.Message);
			return new ReportLogicResponse
			{
				StatusCode = 500,
				Status = false,
				Message = e.Message
			};
		}
	}

	public async Task<PaginationResDto<ReportReadDto>> List(PaginationReqDto<ReportFilterDto> pagination)
	{
		var filter = Builders<Report>.Filter.Empty;

		if (pagination.Filter.From is not null)
		{
			filter = filter & Builders<Report>.Filter.Gte(x => x.CreatedAt, pagination.Filter.From);
		}

		if (pagination.Filter.To is not null)
		{
			filter = filter & Builders<Report>.Filter.Lte(x => x.CreatedAt, pagination.Filter.To);
		}

		if (pagination.Filter.Type is not null)
		{
			filter = filter & Builders<Report>.Filter.Eq(x => x.Type, pagination.Filter.Type);
		}

		if (pagination.Filter.IsPost is not null)
		{
			var isPostFilter = (pagination.Filter.IsPost is true) ? Builders<Report>.Filter.Not(Builders<Report>.Filter.Eq(x => x.Post, null)) : Builders<Report>.Filter.Not(Builders<Report>.Filter.Eq(x => x.Comment, null));
			filter = filter & isPostFilter;
		}

		var skipPage = (pagination.Page - 1) * pagination.Size;
		IEnumerable<BsonDocument> stages = new List<BsonDocument>() {
			new BsonDocument {
				{ "$sort", new BsonDocument {
					{ "CreatedAt", -1}
				}}
			},
			new BsonDocument {
				{ "$skip", skipPage }
			},
			new BsonDocument {
				{ "$limit", pagination.Size }
			},
		};
		stages = stages.Concat(userLookUpStages);
		var confirmedByLookup = new List<BsonDocument>(){
			new BsonDocument
			{
				{
					"$lookup", new BsonDocument{
						{ "from", "account" },
						{ "localField", "ConfirmedId" },
						{ "foreignField", "_id" },
						{ "as", "ConfirmedBy" }
					}
				}
			},
			new BsonDocument {
				{ "$unwind", new BsonDocument {
					{"path", "$ConfirmedBy"},
					{"preserveNullAndEmptyArrays", true}
				} }
			}
		};
		stages = stages.Concat(confirmedByLookup);

		var reports = await _reportRepo.FindManyAsync(
			filter: filter,
			stages: stages);

		var total = await _reportRepo.CountDocumentAsync(filter: filter, stages: new List<BsonDocument>() { });

		return new PaginationResDto<ReportReadDto>
		{
			Total = (Int32)total,
			Payload = _mapper.Map<ICollection<ReportReadDto>>(reports)
		};
	}

	public async Task<Report?> GetById(string id)
	{
		try
		{
			var report = await _reportRepo.FindOneAsync(
				filter: Builders<Report>.Filter.Eq(x => x.Id, id),
				stages: userLookUpStages);
			return report;
		}
		catch
		{
			return null;
		}
	}

	public async Task<ReportLogicResponse> ConfirmReport(string id, ReportConfirmDto confirmDto, string accountId)
	{
		var report = await GetById(id);
		if (report is null)
		{
			return new ReportLogicResponse()
			{
				StatusCode = 404,
				Status = false,
				Message = "Report not found"
			};
		}

		using var session = await _reportRepo.StartSessionAsync();
		try
		{
			session.StartTransaction();

			if (confirmDto.IsAccepted is true && report.Post is not null)
			{
				var status = await _postLogic.DeletePost(report.Post.Id);
				if (status is false)
				{
					return new ReportLogicResponse()
					{
						StatusCode = 400,
						Status = false,
						Message = "Fail to delete post"
					};
				}
			}

			if (confirmDto.IsAccepted is true && report.Comment is not null)
			{
				var status = await _commentLogic.DeleteComment(report.Comment.Id);
				if (status is false)
				{
					return new ReportLogicResponse()
					{
						StatusCode = 400,
						Status = false,
						Message = "Fail to delete comment"
					};
				}
			}

			var filter = Builders<Report>.Filter.Eq(x => x.Id, id);
			var update = Builders<Report>.Update.Set(x => x.Status, (confirmDto.IsAccepted is true) ? ReportStatus.APPROVE : ReportStatus.REJECT)
				.Set(x => x.ModifiedAt, DateTime.UtcNow)
				.Set(x => x.ConfirmedId, accountId);

			var rs = await _reportRepo.UpdateOneAsync(session, filter, update);
			await session.CommitTransactionAsync();

			return new ReportLogicResponse()
			{
				StatusCode = 200,
				Status = true,
				Message = "Report comfirm successfully"
			};
		}
		catch (Exception e)
		{
			_logger.LogError(e.Message);
			await session.AbortTransactionAsync();
			return new ReportLogicResponse()
			{
				StatusCode = 500,
				Status = true,
				Message = "Fail to update report"
			};
		}
	}
}