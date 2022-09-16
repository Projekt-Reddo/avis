namespace MainService.Utils;

public static class ResponseMessage
{
    // Song msg
    public const string SONG_NOT_FOUND = "No songs found";
    public const string UPLOAD_SONG_FILE_FAIL = "Song information saved successfully but failed to save the mp3 file!";
    public const string UPLOAD_SONG_SUCCESS = "Song upload successfully";

    // Post msg


    // User msg


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
}