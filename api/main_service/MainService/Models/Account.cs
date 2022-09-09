using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;

namespace MainService.Models;

/// <summary>
/// Account model storing all information about a account
/// </summary>
public class Account : BaseModel
{
    [StringLength(100, MinimumLength = 6)]
    public string Name { get; set; } = null!;

    [EmailAddress]
    public string Email { get; set; } = null!;

    public string Uid { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string Status { get; set; } = null!;

    // [Url]
    // public string Avatar { get; set; } = null!;

    // public string Issuer { get; set; } = null!;

    public List<ObjectId>? SavedPosts { get; set; }
}