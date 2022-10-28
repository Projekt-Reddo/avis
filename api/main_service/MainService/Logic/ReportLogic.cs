using System.Collections.Immutable;
using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Utils;
using MongoDB.Driver;

namespace MainService.Logic;

public interface IReportLogic
{
	Task<ReportLogicResponse> PostReport(ReportCreateDto reportDto);
	Task<ReportLogicResponse> CommentReport(ReportCreateDto reportDto);
	Task<PaginationResDto<ReportReadDto>> List(PaginationReqDto<ReportFilterDto> pagination);
}

public class ReportLogic : IReportLogic
{
	private readonly IReportRepo _reportRepo;
	private readonly IPostLogic _postLogic;
	private readonly ICommentLogic _commentLogic;
	private readonly IMapper _mapper;
	private readonly ILogger<ReportLogic> _logger;

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
		(var total, var reports) = await _reportRepo.FindManyAsync(
			filter: filter,
			limit: pagination.Size,
			skip: skipPage);

		return new PaginationResDto<ReportReadDto>
		{
			Total = (Int32)total,
			Payload = _mapper.Map<ICollection<ReportReadDto>>(reports)
		};
	}
}