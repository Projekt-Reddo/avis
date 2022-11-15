public static class Constants
{
	/// <summary>
	/// Path config in AWS S3
	/// </summary>
	public static class S3Config
	{
		public const string SONGS_FOLDER = "raw";
		public const string IMAGES_FOLDER = "images";
		public const string VIDEOS_FOLDER = "videos";
		public const string AUDIOS_FOLDER = "audios";
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
		public const string NAME_ASC = "Name Ascending";
		public const string NAME_DESC = "Name Descending";
		public const string JOIN_ASC = "Joined Date Ascending";
		public const string JOIN_DESC = "Joined Date Descending";
	}

	public static class CommentSortFilterOption
	{
		public const string Upvote_DESC = "Upvote Descending";
		public const string CreateAt_DESC = "CreateAt Descending";
	}

	/// <summary>
	/// Account roles
	/// </summary>
	public static class AccountRoles
	{
		public const string ADMIN = "admin";
		public const string MODERATOR = "moderator";
		public const string USER = "user";
	}

	public const string DEFAULT_AVATAR = "https://static.wikia.nocookie.net/virtualyoutuber/images/8/8b/Hoshimachi_Suisei_2019_Portrait.png";
	public const string DEFAULT_SONG_THUMBNAIL = "https://songdewnetwork.com/sgmedia/assets/images/default-album-art.png";

	public static class ReportType
	{
		public const string NUDITY = "Nudity";
		public const string VIOLENCE = "Violence";
		public const string SPAM = "Spam";
		public const string HATE_SPEECH = "Hate Speech";
		public const string TERROISM = "Terroism";
		public const string SOMETHING_ELSE = "Something Else";
	}

	public static class JwtTokenPayload
	{
		public const string USER_ID = "user_id";
	}

	public static class PostStatus
	{
		public const string PUBLIC = "public";
		public const string PRIVATE = "private";
	}

	public static class ReportStatus
	{
		public const string APPROVE = "approve";
		public const string REJECT = "reject";
	}

	/// <summary>
	/// Hub Return Method
	/// </summary>
	public static class HubReturnMethod
	{
		public const string RECEIVENOTIFICATION = "Receive Notification";
	}

	/// <summary>
	/// RabbitMQ Event Type
	/// </summary>
	public static class EventType
	{
		public const string REPORT_ACCEPTED = "Report Accepted";
		public const string REPORT_DENIED = "Report Denied";
		public const string POST_DELETED = "Post Accepted Delete";
	}

	public enum ResourceType
	{
		Post,
		Comment,
	}
}
