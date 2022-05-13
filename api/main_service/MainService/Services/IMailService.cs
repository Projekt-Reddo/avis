using MainService.Models;

namespace MainService.Services
{
    public interface IMailService
    {
        /// <summary>
        /// Send an email
        /// </summary>
        /// <param name="mailRequest"></param>
        Task SendEmailAsync(MailRequest mailRequest);
    }
}