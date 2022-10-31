using System.ComponentModel.DataAnnotations;

namespace MainService.Dtos;

public class ReportCreateDto
{
	public string? UserId { get; set; } = null!;

	public string? Content { get; set; } = null!;

	private string type = string.Empty;
	[Required(ErrorMessage = "Type must be in an element in accepted list")]
	public string Type
	{
		get { return type; }
		set
		{
			type = null!;
			foreach (var property in typeof(Constants.ReportType).GetFields())
			{
				if (!String.IsNullOrWhiteSpace(value))
				{
					var x = (property.GetValue(null) ?? "").ToString();
					if (value.ToLower() == (property.GetValue(null) ?? "").ToString()!.ToLower())
					{
						type = value;
					}
				}
			}
		}
	}


	public string? PostId { get; set; } = null!;

	public string? CommentId { get; set; } = null!;
}

public class ReportReadDto
{
	public string Id { get; set; } = null!;

	public DateTime CreatedAt { get; set; }

	public DateTime ModifiedAt { get; set; }

	public AccountReadDto User { get; set; } = null!;

	public string Content { get; set; } = null!;

	public string Type { get; set; } = null!;

	public PostReadDto? Post { get; set; } = null!;

	public CommentReadDto? Comment { get; set; } = null!;

	public string? Status { get; set; } = null!;

	public AccountReadDto? ConfirmedBy { get; set; } = null!;
}

public class ReportConfirmDto
{
	public bool IsAccepted { get; set; } = false;
}

public class ReportLogicResponse
{
	public int StatusCode { get; set; } = 200;
	public string Message { get; set; } = null!;
	public bool Status { get; set; } = true;
}