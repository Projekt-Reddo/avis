using System.ComponentModel.DataAnnotations;

namespace MainService.Dtos
{
    public class AccountCreateDto
    {
        public string Email { get; set; } = null!;

        public string Uid { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? Avatar { get; set; }
    }

    public class AccountReadDto
    {
        public string Id { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Avatar { get; set; } = null!;

        public string Role { get; set; } = null!;
    }

    public class AccountUpdateDto
    {
        public string? Name { get; set; } = null!;
    }

    public class AccountResponseDto
    {
        public string Id { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Avatar { get; set; } = null!;

        public DateTime? JoinedDate { get; set; }

        public string Role { get; set; } = null!;

        public bool IsBanned { get; set; } = false;

        public DateTime PostMutedUntil { get; set; }

        public DateTime CommentMutedUntil { get; set; }
    }

    public class AccountFilterDto
    {
        public string? Name { get; set; }

        public string? Sort { get; set; }

        public DateTime? JoinedStart { get; set; }

        public DateTime? JoinedEnd { get; set; }

        public bool isModerator { get; set; }

        public bool isBanned { get; set; }

        public bool isMuted { get; set; }
    }

    public class AccountSortDto
    {
        public string SortBy { get; set; } = null!;

        public int ADESC { get; set; }
    }

    public class AccountIdFilter {
        public string Id { get; set; } = null!;
    }

    public class AccountProfileReadDto {
        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Avatar { get; set; } = null!;

        public DateTime? JoinedDate { get; set; }
    }

    public class AccountProfileUpdateDto
    {
		[StringLength(100, MinimumLength = 6, ErrorMessage = "The field Name must be a string with a minimum length of 6 and a maximum length of 100")]
		public string Name { get; set; } = null!;

        public IFormFile? AvatarFile { get; set; }
    }

	public class AccountUidList
	{
		public string[] Uids { get; set; } = null!;
	}
    public class AccountsMuteDto
    {
        public string[] Uids { get; set; } = null!;
		public int? MutePostDays { get; set; }
        public int? MuteCommentDays { get; set; }
	}
}
