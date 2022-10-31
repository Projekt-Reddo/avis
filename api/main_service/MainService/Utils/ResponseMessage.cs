namespace MainService.Utils;

public static class ResponseMessage
{
	// Song msg
	public const string SONG_NOT_FOUND = "No songs found";
	public const string UPLOAD_SONG_FILE_FAIL = "Song information saved successfully but failed to save the mp3 file!";
	public const string UPLOAD_SONG_SUCCESS = "Song upload successfully";
	public const string SONG_CREATE_FAIL = "Fail to create song please check your details";
	public const string SONG_DELETE_SUCCESS = "Song delete successfull";
	public const string SONG_DELETE_FAIL = "Fail to delete song";
	public const string SONG_UPDATE_FAIL = "Fail to update song";
	public const string SONG_UPDATE_SUCCESS = "Song update successfull";


	// Post msg
	public const string POST_NOT_FOUND = "No post found";
	public const string POST_CREATE_SUCCESS = "Create a post successfully";
	public const string POST_CREATE_MEDIA_TYPE = "Media type is not supported";
	public const string POST_UPLOAD_FILE_FAIL = "Fail to upload files";
	public const string POST_VOTE_SUCCESS = "Post Vote Successfully";
	public const string POST_VOTE_FAIL = "Post Vote Failed";
	public const string POST_UPDATE_STATUS_SUCCESS = "Updated status of the post";
	public const string POST_SAVE_FAIL = "You already save this post";
	public const string POST_SAVE_SUCCESS = "Save post successfully";
	public const string POST_DELETE_FAIL = "Fail to delete post";

	// Report msg
	public const string REPORT_CREATE_SUCCESS = "Create a report successfully";
	public const string REPORT_NO_IDS = "A postId or commentId is required for reporting";
	public const string REPORT_CONFIRM_SUCCESS = "Confirm reports successfully";
	public const string REPORT_CONFIRM_PARTIAL_SUCCESS = "Confirm report successfully, but there are some reports can't be confirmed";
	public const string REPORT_CONFIRM_FAIL = "Fail to update report";
	public const string REPORT_NOT_FOUND = "Report not found";


	// File extension check msg
	public const string NO_FILE_UPLOAD = "No upload file";
	public const string WRONG_FILE_EXTENSION = "Not support file extension(s)";
	public const string FAKE_FILE_EXTENSION = "Not support FAKE extension";


	// Genre msg
	public const string GENRE_EXISTED = "Genre is already existed";
	public const string GENRE_CREATE_SUCCESS = "Create new genres successfully";
	public const string GENRE_CREATE_FAIL = "Fail to create new genres";
	public const string GENRE_CREATE_SUCESS_AND_FAIL = "New genres were created successfully but there are some genres failed to insert";
	public const string GENRE_DELETE_FAIL = "Fail to delete genres";
	public const string GENRE_DELETE_SUCCESS = "Delete genre successfully";
	public const string GENRE_DELETE_SUCCESS_AND_FAIL = "Delete genre successfully but there are some genres that failed to deleted";

	// Artist msg
	public const string ARTIST_EXISTED = "Artist is already existed";
	public const string ARTIST_CREATE_SUCCESS = "Create new artists successfully";
	public const string ARTIST_CREATE_FAIL = "Fail to create new artists";
	public const string ARTIST_CREATE_SUCESS_AND_FAIL = "New artists were created successfully but there are some artists failed to insert";
	public const string ARTIST_DELETE_FAIL = "Fail to delete artists";
	public const string ARTIST_DELETE_SUCCESS = "Delete artist successfully";
	public const string ARTIST_DELETE_SUCCESS_AND_FAIL = "Delete artist successfully but there are some artists that failed to deleted";

	// Comment msg
	public const string COMMENT_CREATE_SUCCESS = "Add new comment successfully";
	public const string COMMENT_CREATE_FAIL = "Add new comment failed";
	public const string COMMENT_CREATE_MEDIA_FAIL = "Media type is not supported";
	public const string COMMENT_NOT_FOUND = "No comment found";
	public const string COMMENT_VOTE_SUCCESS = "Comment Vote Successfully";
	public const string COMMENT_VOTE_FAIL = "Post Vote Failed";
	public const string COMMENT_DELETE_FAIL = "Fail to delete comment";


	// Account msg
	public const string ACCOUNT_EMAIL_DUPLICATED = "Email duplicated!";
	public const string ACCOUNT_CREATE_SUCCESS = "Account created successfully";
	public const string ACCOUNT_CREATE_FAILED = "Account failed to create";
	public const string ACCOUNT_GOOGLE_LOGIN_SUCCESS = "This account is exist and no need to set up!";
	public const string ACCOUNT_NOT_FOUND = "Cannot find your account!";
	public const string ACCOUNT_PROFILE_UPDATE_SUCCESS = "Profile updated!";
	public const string ACCOUNT_PROFILE_UPDATE_FAIL = "Profile failed to update";
	public const string ACCOUNT_PROMOTED = "Account promoted!";
	public const string ACCOUNT_DEMOTED = "Account demoted!";
}
