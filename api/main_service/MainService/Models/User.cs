using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace MainService.Models;

/// <summary>
/// User model storing all information about a user
/// </summary>
public class User : BaseModel
{
    [StringLength(100, MinimumLength = 6)]
    public string DisplayName { get; set; } = null!;

    [EmailAddress]
    public string Email { get; set; } = null!;

    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string Status { get; set; } = null!;

    [Url]
    public string Avatar { get; set; } = null!;

    public string Issuer { get; set; } = null!;

    public List<ObjectId>? FavoritePosts { get; set; }
}