namespace MainService.Dtos
{
    public class UserCreateDto
    {
        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Fullname { get; set; } = null!;

        public string Avatar { get; set; } = null!;
    }

    public class UserReadDto
    {
        public string Id { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Fullname { get; set; } = null!;
        public string Avatar { get; set; } = null!;
        public string Role { get; set; } = null!;
    }

    public class UserUpdateDto
    {
        public string? Fullname { get; set; } = null!;
        public string? Password { get; set; } = null!;
    }
}