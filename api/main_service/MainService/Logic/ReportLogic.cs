using System.Collections.Immutable;
using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
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
	Task<ReportLogicResponse> ConfirmReports(ReportConfirmDto confirmDto, string accountId);
}

public class ReportLogic : IReportLogic
{
	private readonly IReportRepo _reportRepo;
	private readonly IPostLogic _postLogic;
	private readonly ICommentLogic _commentLogic;
	private readonly IMapper _mapper;
	private readonly ILogger<ReportLogic> _logger;
	private readonly IMessageQueuePublisher _messagePublisher;
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
		ILogger<ReportLogic> logger,
		IMessageQueuePublisher messagePublisher
	)
	{
		_reportRepo = reportRepo;
		_postLogic = postLogic;
		_commentLogic = commentLogic;
		_mapper = mapper;
		_logger = logger;
		_messagePublisher = messagePublisher;
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

	public async Task<bool> UpdateReport(string id, bool isAccepted, string accountId, IClientSessionHandle? session = null!)
	{
		var filter = Builders<Report>.Filter.Eq(x => x.Id, id);
		var update = Builders<Report>.Update.Set(x => x.Status, (isAccepted is true) ? ReportStatus.APPROVE : ReportStatus.REJECT)
			.Set(x => x.ModifiedAt, DateTime.UtcNow)
			.Set(x => x.ConfirmedId, accountId);

		var rs = false;
		if (session is null)
		{
			rs = await _reportRepo.UpdateOneAsync(filter, update);
		}
		else
		{
			rs = await _reportRepo.UpdateOneAsync(session, filter, update);
		}
		return rs;
	}

	public async Task<ReportLogicResponse> ConfirmReport(string id, bool isAccepted, string accountId)
	{
		var report = await GetById(id);
		if (report is null)
		{
			return new ReportLogicResponse()
			{
				StatusCode = 404,
				Status = false,
				Message = ResponseMessage.REPORT_NOT_FOUND
			};
		}

		if (report.Status is not null && report.Status == ReportStatus.APPROVE && isAccepted == false)
		{
			return new ReportLogicResponse()
			{
				StatusCode = 400,
				Status = false,
				Message = ResponseMessage.REPORT_REJECT_ACCEPTED
			};
		}

		using var session = await _reportRepo.StartSessionAsync();
		try
		{
			session.StartTransaction();

			if (isAccepted is true && report.Post is not null)
			{
				var status = await _postLogic.DeletePost(report.Post.Id);
				if (status is false)
				{
					return new ReportLogicResponse()
					{
						StatusCode = 400,
						Status = false,
						Message = ResponseMessage.POST_DELETE_FAIL
					};
				}

				await AcceptRelatedReports(report.Post.Id, accountId, true, report.Id, session);
			}

			if (isAccepted is true && report.Comment is not null)
			{
				var status = await _commentLogic.DeleteComment(report.Comment.Id);
				if (status is false)
				{
					return new ReportLogicResponse()
					{
						StatusCode = 400,
						Status = false,
						Message = ResponseMessage.COMMENT_DELETE_FAIL
					};
				}

				await AcceptRelatedReports(report.Comment.Id, accountId, false, report.Id, session);
			}

			var rs = await UpdateReport(id, isAccepted, accountId, session);
			await session.CommitTransactionAsync();

			if (isAccepted is false)
			{
				SendNotifications(false, report, false);
			}

			if (isAccepted is true)
			{
				SendNotifications(true, report, true);
			}

			return new ReportLogicResponse()
			{
				StatusCode = 200,
				Status = true,
				Message = ResponseMessage.REPORT_CONFIRM_SUCCESS
			};
		}
		catch (Exception e)
		{
			_logger.LogError(e.Message);
			await session.AbortTransactionAsync();
			return new ReportLogicResponse()
			{
				StatusCode = 500,
				Status = false,
				Message = ResponseMessage.REPORT_CONFIRM_FAIL
			};
		}
	}

	public async Task<ReportLogicResponse> AcceptRelatedReports(string objectId, string accountId, bool isPost, string currentReportId, IClientSessionHandle? session)
	{
		var filter = isPost ? Builders<Report>.Filter.Eq(x => x.Post!.Id, objectId) : Builders<Report>.Filter.Eq(x => x.Comment!.Id, objectId)
			& Builders<Report>.Filter.Ne(x => x.Id, currentReportId);
		(var total, var reports) = await _reportRepo.FindManyAsync(filter: filter);

		if (total == 0)
		{
			return new ReportLogicResponse()
			{
				StatusCode = 200,
				Status = true,
				Message = ResponseMessage.REPORT_CONFIRM_SUCCESS
			};
		}

		var successCount = 0;
		foreach (var report in reports)
		{
			var rs = await UpdateReport(report.Id, true, accountId, session);
			successCount += 1;

			SendNotifications(true, report, false);
		}

		return new ReportLogicResponse()
		{
			StatusCode = 200,
			Status = true,
			Message = ResponseMessage.REPORT_CONFIRM_SUCCESS
		};
	}

	public async Task<ReportLogicResponse> ConfirmReports(ReportConfirmDto confirmDto, string accountId)
	{
		if (confirmDto.Ids.Count() == 0)
		{
			confirmDto.Ids = Enumerable.Empty<string>();
		}

		var successCount = 0;
		foreach (var id in confirmDto.Ids)
		{
			var rs = await ConfirmReport(id, confirmDto.IsAccepted, accountId);

			if (rs.Status is true)
			{
				successCount += 1;
			}
		}

		if (successCount == 0)
		{
			return new ReportLogicResponse()
			{
				StatusCode = 400,
				Status = false,
				Message = ResponseMessage.REPORT_CONFIRM_FAIL
			};
		}

		if (successCount < confirmDto.Ids.Count())
		{
			return new ReportLogicResponse()
			{
				StatusCode = 200,
				Status = true,
				Message = ResponseMessage.REPORT_CONFIRM_PARTIAL_SUCCESS
			};
		}

		return new ReportLogicResponse()
		{
			StatusCode = 200,
			Status = true,
			Message = ResponseMessage.REPORT_CONFIRM_SUCCESS
		};
	}

	public void SendNotifications(bool isAccepted, Report report, bool isSendPostOwner)
	{
		// Add Notification to database and send it to the reporter in real time
		try
		{
			var notifyMsgForReporter = new EventDto();

			// Send Delete Post Notification
			if (isSendPostOwner is true && isAccepted is true)
			{
				// Notify message for Post Owner
				var notifyMsgForPostOwner = new EventDto()
				{
					ReceiverId = report.Post is null ? report.Comment!.UserId : report.Post.UserId,
					Message = ResponseMessage.NOTIFY_POST_DELETED,
					IsRead = false,
					Event = EventType.POST_DELETED
				};

				_messagePublisher.PublishSendNotifi(notifyMsgForPostOwner);

			}

			// Send Accepted Notification
			if (isSendPostOwner is false && isAccepted is true)
			{
				// Notify message for Reporter
				notifyMsgForReporter = new EventDto()
				{
					ReceiverId = report.UserId,
					Message = ResponseMessage.NOTIFY_REPORT_ACCEPTED_MSG,
					IsRead = false,
					Event = EventType.REPORT_ACCEPTED
				};

				_messagePublisher.PublishSendNotifi(notifyMsgForReporter);
			}

			// Send Denied Notification
			if (isSendPostOwner is false && isAccepted is false)
			{
				// Notify message for Reporter
				notifyMsgForReporter = new EventDto()
				{
					ReceiverId = report.UserId,
					Message = ResponseMessage.NOTIFY_REPORT_DENIED_MSG,
					IsRead = false,
					Event = EventType.REPORT_DENIED
				};

				_messagePublisher.PublishSendNotifi(notifyMsgForReporter);
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error publishing message");
		}
	}
}