namespace MainService.Models
{
    /// <summary>
    /// Mail setting - model storing all information to setting up a mail server
    /// </summary>
    public class MailSettings
    {
        public string Mail { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Host { get; set; } = null!;
        public int Port { get; set; }
    }
}