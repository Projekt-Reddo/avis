namespace MainService.Dtos
{
    public class AccountCreateDto
    {
        public string Email { get; set; } = null!;

        public string Uid { get; set; } = null!;

        public string Name { get; set; } = null!;
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
}