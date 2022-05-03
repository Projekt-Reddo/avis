using System.ComponentModel.DataAnnotations;

namespace MainService.Models
{
    /// <summary>
    /// User model storing all information about a user
    /// </summary>
    public class User : BaseModel
    {
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Fullname { get; set; } = null!;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Url]
        public string Avatar { get; set; } = null!;

        public string Issuer { get; set; } = null!;

        [Required]
        public string Role { get; set; } = null!;

        public List<string> SearchHistories { get; set; } = null!;

        public List<string> FavoriteSongs { get; set; } = null!;

        public List<string> FavoritePosts { get; set; } = null!;
    }
}