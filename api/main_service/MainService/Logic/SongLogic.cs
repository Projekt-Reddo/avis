using AutoMapper;
using MainService.Data;
using MainService.Dtos;
using MainService.Models;
using MainService.Services;
using MainService.Utils;
using MongoDB.Bson;
using MongoDB.Driver;
using static Constants;

namespace MainService.Logic;

public interface ISongLogic
{
	Task<bool> UploadNewSong(Song song, Stream stream, string contentType, string fileExtension);
	Task<bool> UploadNewThumbnail(Song song, Stream stream, string contentType, string fileExtension);
	FilterDefinition<Song> SongFilter(PaginationReqDto<SongFilterDto> pagination);
	Task<Song?> GetSongById(string id);
	Task<IEnumerable<Song>> GetSongByGenres(ICollection<string> genres, string existedId);
	Task<(bool status, string message)> UpdateSong(string id, SongUpdateDto songUpdate);
}

public class SongLogic : ISongLogic
{
	private readonly IS3Service _s3Service;
	private readonly IConfiguration _configuration;
	private readonly ISongRepo _songRepo;
	private readonly ILogger<SongLogic> _logger;
	private readonly IMapper _mapper;
	private readonly IFileStorageService _fileStorage;
	private readonly IArtistLogic _artistLogic;
	private BsonDocument artistLookup = new BsonDocument {
			{ "from", "artist" },
			{ "localField", "ArtistIds" },
			{ "foreignField", "_id" },
			{ "as", "Artists" }
		};
	private FilterDefinition<Song> availableSongFilter = Builders<Song>.Filter.Not(Builders<Song>.Filter.Eq(x => x.IsDeleted, true));

	public SongLogic(
		IS3Service s3Service,
		IConfiguration configuration,
		ISongRepo songRepo,
		ILogger<SongLogic> logger,
		IMapper mapper,
		IFileStorageService fileStorage,
		IArtistLogic artistLogic
	)
	{
		_s3Service = s3Service;
		_configuration = configuration;
		_songRepo = songRepo;
		_logger = logger;
		_mapper = mapper;
		_fileStorage = fileStorage;
		_artistLogic = artistLogic;
	}

	public async Task<bool> UploadNewSong(Song song, Stream stream, string contentType, string fileExtension)
	{
		(var songUploadStatus, var songUrl) = await _fileStorage.UploadSong(
			$"{song.Id}{fileExtension}",
			stream,
			contentType
		);

		if (songUploadStatus is false)
		{
			return false;
		}

		var filter = Builders<Song>.Filter.Eq(x => x.Id, song.Id);
		var update = Builders<Song>.Update.Set(x => x.Url!.Internal, songUrl);
		var rs = await _songRepo.UpdateOneAsync(filter, update);
		return rs;
	}

	public async Task<bool> UploadNewThumbnail(Song song, Stream stream, string contentType, string fileExtension)
	{
		(var thumbnailUploadStatus, var thumbnailUrl) = await _fileStorage.UploadImage(
			$"{song.Id}{fileExtension}",
			stream,
			contentType
		);

		if (thumbnailUploadStatus is false)
		{
			song.Thumbnail = DEFAULT_SONG_THUMBNAIL;
		}
		else
		{
			song.Thumbnail = thumbnailUrl;
		}

		var filter = Builders<Song>.Filter.Eq(x => x.Id, song.Id);
		var update = Builders<Song>.Update.Set(x => x.Thumbnail, song.Thumbnail);
		var rs = await _songRepo.UpdateOneAsync(filter, update);
		return rs;
	}

	public FilterDefinition<Song> SongFilter(PaginationReqDto<SongFilterDto> pagination)
	{

		var songFilter = Builders<Song>.Filter.Not(Builders<Song>.Filter.Eq(x => x.IsDeleted, true));

		if (pagination.Filter is not null)
		{

			// Name Filter
			if (!String.IsNullOrWhiteSpace(pagination.Filter.Title))
			{
				songFilter = songFilter & Builders<Song>.Filter.Regex("Title", new BsonRegularExpression(pagination.Filter.Title, "i"));
			}

			// Genres Filter
			if (pagination.Filter.Genres != null)
			{
				songFilter = songFilter & Builders<Song>.Filter.All(x => x.Genres, pagination.Filter.Genres);
			}

			// Created At Filter
			if (!String.IsNullOrWhiteSpace(pagination.Filter.CreatedStart.ToString()))
			{
				songFilter = songFilter & Builders<Song>.Filter.Gte(x => x.CreatedAt, pagination.Filter.CreatedStart);
			}

			if (!String.IsNullOrWhiteSpace(pagination.Filter.CreatedEnd.ToString()))
			{
				songFilter = songFilter & Builders<Song>.Filter.Lte(x => x.CreatedAt, pagination.Filter.CreatedEnd);
			}

			// Modified At Filter
			if (!String.IsNullOrWhiteSpace(pagination.Filter.ModifiedStart.ToString()))
			{
				songFilter = songFilter & Builders<Song>.Filter.Gte(x => x.ModifiedAt, pagination.Filter.ModifiedStart);
			}

			if (pagination.Filter.ModifiedEnd != null)
			{
				songFilter = songFilter & Builders<Song>.Filter.Lte(x => x.ModifiedAt, pagination.Filter.ModifiedEnd);
			}
		}

		return songFilter;
	}

	public async Task<Song?> GetSongById(string id)
	{
		try
		{
			var filter = Builders<Song>.Filter.Eq(x => x.Id, id)
						 & availableSongFilter;

			var song = await _songRepo.FindOneAsync(
				filter: filter,
				lookup: artistLookup
			);

			return song;
		}
		catch (Exception e)
		{
			_logger.LogError(e.Message);
			return null;
		}
	}

	public async Task<IEnumerable<Song>> GetSongByGenres(ICollection<string> genres, string existedId)
	{
		try
		{
			var filter = Builders<Song>.Filter.AnyIn(x => x.Genres, genres) & availableSongFilter
				& Builders<Song>.Filter.Not(Builders<Song>.Filter.Eq(x => x.Id, existedId));

			(_, var songs) = await _songRepo.FindManyAsync(
				filter: filter,
				lookup: artistLookup,
				limit: 10
			);

			return songs;
		}
		catch (Exception e)
		{
			_logger.LogError(e.Message);
			return Enumerable.Empty<Song>();
		}
	}

	public async Task<(bool status, string message)> UpdateSong(string id, SongUpdateDto songUpdate)
	{
		using var session = await _songRepo.StartSessionAsync();
		try
		{
			session.StartTransaction();

			var existedSong = await GetSongById(id);
			if (existedSong is null)
			{
				return (false, ResponseMessage.SONG_NOT_FOUND);
			}

			var notFoundArtists = new List<string>();
			foreach (var artistId in songUpdate.ArtistIds)
			{
				var artist = await _artistLogic.GetById(artistId);
				if (artist is null)
				{
					notFoundArtists.Add(artistId);
				}
			}
			if (notFoundArtists.Count > 0)
			{
				return (false, $"Not found artists with ids: {String.Join(", ", notFoundArtists)}");
			}

			var song = _mapper.Map<Song>(songUpdate);

			// Keep some old critical values
			song.Id = id;
			if (song.Url is null)
			{
				song.Url = new Url();
			}
			song.Url.Internal = existedSong.Url!.Internal;

			if (songUpdate.Thumbnail is not null)
			{
				(var isImageFile, var imageCheckMessage) = FileExtension.CheckImageExtension(songUpdate.Thumbnail);
				if (isImageFile is false)
				{
					return (false, imageCheckMessage);
				}

				await _s3Service.DeleteFileAsync(
					_configuration.GetValue<string>("S3:ResourcesBucket"),
					S3Config.IMAGES_FOLDER,
					$"{id}{FileExtension.GetFileExtension(songUpdate.Thumbnail)}"
				);
				var uploadStatus = await UploadNewThumbnail(
					song,
					songUpdate.Thumbnail.OpenReadStream(),
					songUpdate.Thumbnail.ContentType,
					FileExtension.GetFileExtension(songUpdate.Thumbnail));
			}

			var filter = Builders<Song>.Filter.Eq(x => x.Id, id);
			var update = Builders<Song>.Update.Set(x => x.Title, song.Title)
											  .Set(x => x.Alias, song.Alias)
											  .Set(x => x.Lyrics, song.Lyrics)
											  .Set(x => x.Description, song.Description)
											  .Set(x => x.Genres, song.Genres)
											  .Set(x => x.Url, song.Url)
											  .Set(x => x.ArtistIds, song.ArtistIds)
											  .Set(x => x.ModifiedAt, DateTime.UtcNow);

			var rs = await _songRepo.UpdateOneAsync(session, filter, update);
			await session.CommitTransactionAsync();

			if (rs is false)
			{
				return (false, ResponseMessage.SONG_UPDATE_FAIL);
			}
			return (true, ResponseMessage.SONG_UPDATE_SUCCESS);
		}
		catch (Exception e)
		{
			_logger.LogError(e.Message);
			await session.AbortTransactionAsync();
			return (false, ResponseMessage.SONG_UPDATE_FAIL);
		}
	}
}