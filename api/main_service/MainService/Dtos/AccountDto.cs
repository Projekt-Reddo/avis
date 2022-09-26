using MainService.Models;

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
        public string Name { get; set; } = null!;

        public string Sort { get; set; } = null!;

        public DateTime? JoinedStart { get; set; } = null!;

        public DateTime? JoinedEnd { get; set; } = null!;

        public bool isModerator { get; set; }

        public bool isBanned { get; set; }

        public bool isMuted { get; set; }
    }

    public class AccountSortDto
    {
        public string SortBy { get; set; } = null!;

        public int ADESC { get; set; }
    }
}