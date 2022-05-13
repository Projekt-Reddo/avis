using MailKit.Security;
using MainService.Models;
using Microsoft.Extensions.Options;
using MimeKit;

namespace MainService.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;

        public MailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
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
    }
}