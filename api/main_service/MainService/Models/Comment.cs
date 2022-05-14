using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;

namespace MainService.Models
{
    /// <summary>
    /// Comment model for storing all information about a comment
    /// </summary>
    public class Comment : BaseModel
    {
        public string Content { get; set; } = null!;

        [Range(0, int.MaxValue)]
        public int UpVote { get; set; }

        [Range(0, int.MaxValue)]
        public int DownVote { get; set; }

        #region One-to-One relationship between this comment and its user

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string UserId { get; set; } = null!;

        /// <summary>
        /// One-to-One relationship between this comment and its user
        /// </summary>
        public User? User { get; set; } = null!;

        #endregion

        #region One-to-Many relationship between this comment and its post

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string PostId { get; set; } = null!;

        /// <summary>
        /// One-to-One relationship between this comment and its post
        /// </summary>
        public Post? Post { get; set; } = null!;

        #endregion

        #region Many-to-One relationship between this comment and its replies

        /// <summary>
        /// Many-to-One self relationship between this comment and its replys
        /// </summary>
        public ICollection<Comment>? Replies { get; set; } = null!;

        #endregion

        #region One-to-Many relationship between this comment and its parent comments

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        /// <summary>
        /// Id of parent comment of this comment. If null, this comment is a root comment
        /// </summary>
        public string ParentId { get; set; } = null!;

        /// <summary>
        /// One-to-Many self relationship between this comment and its parent
        /// </summary>
        public Comment? ParentComment { get; set; } = null!;

        #endregion
    }
}