using MailKit.Security;
using MainService.Models;
using Microsoft.Extensions.Options;
using MimeKit;
using static Constants;

namespace MainService.Services
{
    public interface IMailService
    {
        /// <summary>
        /// Send an email
        /// </summary>
        /// <param name="mailRequest"></param>
        Task SendEmailAsync(MailRequest mailRequest);

        /// <summary>
        /// Get a mail body template
        /// </summary>
        /// <param name="mailTemplate"></param>
        /// <param name="url"></param>
        public string GetMailTemplate(string mailTemplate, string url);
    }

    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;

        private IDictionary<string, string> _mailTemplate;

        public MailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;

            LoadMailTemplates();
        }

        /// <summary>
        /// Send an email to the specified email address
        /// </summary>
        /// <param name="mailRequest"></param>
        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            // Multipurpose Internet Mail Extensions (MIME) are a set of conventions for encoding and representing information for electronic mail.
            var email = new MimeMessage();

            // Set the sender email address
            email.Sender = MailboxAddress.Parse(_mailSettings.Mail);

            // Send mail to the receiver, the receiver can be a single email or a list of emails
            email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));

            email.Subject = mailRequest.Subject;

            var builder = new BodyBuilder();

            // Set the body of the email
            builder.HtmlBody = mailRequest.Body;
            email.Body = builder.ToMessageBody();

            // Use SMTP of MailKit instead of default SMTP
            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);

            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }

        /// <summary>
        /// Get a mail body template
        /// </summary>
        /// <param name="mailTemplate"></param>
        /// <param name="url"></param>
        public string GetMailTemplate(string mailTemplate, string url)
        {
            if (!_mailTemplate.ContainsKey(mailTemplate))
            {
                LoadMailTemplates();
            }

            return _mailTemplate[mailTemplate].Replace("<replaceableURL>", url);
        }

        /// <summary>
        /// Load mail templates from files to dictionary
        /// </summary>
        private void LoadMailTemplates()
        {
            _mailTemplate = new Dictionary<string, string>
            {
                { MailTemplate.MAIL_FORGOT_PASSWORD, LoadMailTemplateFromFile(MailTemplate.MAIL_FORGOT_PASSWORD) },
                { MailTemplate.MAIL_VERIFY, LoadMailTemplateFromFile(MailTemplate.MAIL_VERIFY) }
            };
        }

        /// <summary>
        /// Load a mail template from HTML file
        /// </summary>
        /// <param name="mailTemplate"></param>
        private string LoadMailTemplateFromFile(string mailTemplate)
        {
            string filename = "";

            switch (mailTemplate)
            {
                case MailTemplate.MAIL_FORGOT_PASSWORD:
                    { filename = "forgot"; break; }
                case MailTemplate.MAIL_VERIFY:
                    { filename = "confirm"; break; }
                default:
                    { filename = "confirm"; break; }
            }

            string FilePath = Directory.GetCurrentDirectory() + $"\\www\\Templates\\{filename}.html";
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();

            return MailText;
        }
    }
}