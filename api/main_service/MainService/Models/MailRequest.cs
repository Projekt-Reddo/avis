namespace MainService.Models
{
    /// <summary>
    /// Mail request - model storing all information about a mail request
    /// </summary>
    public class MailRequest
    {
        public string ToEmail { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Body { get; set; } = null!;
    }
}