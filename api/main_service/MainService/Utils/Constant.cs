public static class Constants
{
    /// <summary>
    /// Path config in AWS S3
    /// </summary>
    public static class S3Config
    {
        public const string SONGS_FOLDER = "raw-demo";
        public const string IMAGES_FOLDER = "images";
        public const string VIDEOS_FOLDER = "videos";
    }

    /// <summary>
    /// Mail templates
    /// </summary>
    public static class MailTemplate
    {
        public const string MAIL_FORGOT_PASSWORD = "mail/forgotPassword";
        public const string MAIL_VERIFY = "mail/verify";
    }

    public static class PollyHttpClient
    {
        public const string CLIENT_NAME = "client";
    }

    public static class UserSortFilterOption
    {
        public const string NAME_DESC = "Name Desc";
        public const string JOIN_ASC = "Join Asc";
        public const string JOIN_DESC = "Join Desc";
    }
}
