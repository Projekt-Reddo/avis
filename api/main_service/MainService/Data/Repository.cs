using MongoDB.Bson;
using MongoDB.Driver;

namespace MainService.Data
{
    public interface IRepository<TEntity> : IDisposable where TEntity : class
    {
        /// <summary>
        /// Get all documents match filter
        /// </summary>
        /// <param name="indexFilter">
        ///  <para>Bson document for fulltext search</para>
        ///  <para>Example:
        ///  new BsonDocument {
        ///    { "index", "SongIndex" },
        ///    { "text", new BsonDocument {
        ///        { "query", keyword },
        ///        { "path", new BsonDocument {
        ///            { "wildcard", "*" }
        ///        }},
        ///    }}
        ///  }
        ///  </para>
        /// </param>
        /// <param name="filter">Filter builder for filter element</param>
        /// <param name="sort">
        ///     <para>Bson document for sort (1: increase, -1: decrease)</para>
        ///     <para> Example: new BsonDocument { { "fieldName", 1 } }</para>
        /// </param>
        /// <param name="lookup">
        ///  <para>Bson document for lookup</para>
        ///  <para> Example:
        ///  new BsonDocument{
        ///     { "from", "target_document_name" },
        ///     { "localField", "field_for_comparision(Note: using _id not Id)" },
        ///     { "foreignField", "foreign_key" },
        ///     { "as", "joined_document_field" }
        ///  }
        /// </para>
        /// </param>
        /// <param name="project">
        ///  <para>Bson document for lookup</para>
        ///  <para> Example:
        ///   new BsonDocument{
        ///       { "_id", 1 },
        ///       { "CreatedAt", 1 },
        ///       { "ModifiedAt", 1 },
        ///       { "Title", 1 },
        ///       { "Thumbnail", 1 },
        ///       { "Artists",  new BsonDocument{
        ///           {"_id" , 1},
        ///           {"Name" , 1}
        ///       } },
        ///   };
        /// </para>
        /// </param>
        /// <param name="limit">Number of documents to get</param>
        /// <param name="skip">Number of documents to skip</param>
        /// <returns>Total match filter count and List of documents</returns>
        Task<(long total, IEnumerable<TEntity> entities)> FindManyAsync(FilterDefinition<TEntity> filter = default(FilterDefinition<TEntity>)!, BsonDocument? indexFilter = null!, BsonDocument? sort = null!, BsonDocument? lookup = null!, BsonDocument? project = null!, int? limit = null!, int? skip = null!);

        /// <summary>
        /// Get a document by fitler
        /// </summary>
        /// <param name="filter">Bson filter</param>
        /// <returns>Fit condition document</returns>
        Task<TEntity> FindOneAsync(FilterDefinition<TEntity> filter = default(FilterDefinition<TEntity>)!);

        /// <summary>
        /// Add new document to selected collection
        /// </summary>
        /// <param name="entity">Entity to add</param>
        /// <returns>New entity if created</returns>
        Task<TEntity> AddOneAsync(TEntity entity);

        /// <summary>
        /// Update a document in selected collection with new value
        /// </summary>
        /// <param name="id">Document id</param>
        /// <param name="entity">New document</param>
        /// <returns>true(updated) / false(not update)</returns>
        Task<bool> ReplaceOneAsync(string id, TEntity entity);

        /// <summary>
        /// Delete a document in selected collection by id
        /// </summary>
        /// <param name="id">Id to delete</param>
        /// <returns>true(deleted) / false(not delete)</returns>
        Task<bool> DeleteOneAsync(string id);

        /// <summary>
        /// Start a session for transaction
        /// </summary>
        /// <returns></returns>
        Task<IClientSessionHandle> StartSessionAsync();

        /// <summary>
        /// Soft delete documents in selected collection by list id
        /// </summary>
        /// <param name="listId">List Id to soft delete</param>
        /// <returns>true(deleted) / false(not delete)</returns>
        Task<bool> SoftDelete(string[] id, UpdateDefinition<TEntity> update);
    }

    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly IMongoCollection<TEntity> _collection;
        private readonly MongoClient _client;
        protected readonly IMongoDatabase _database;

        public Repository(IMongoContext context)
        {
            _database = context.Database;
            _collection = _database.GetCollection<TEntity>(typeof(TEntity).Name.ToLower());
            _client = context.client;
        }

        public virtual async Task<TEntity> AddOneAsync(TEntity entity)
        {
            await _collection.InsertOneAsync(entity);
            return entity;
        }

        public virtual async Task<(long total, IEnumerable<TEntity> entities)> FindManyAsync(FilterDefinition<TEntity> filter = null!, BsonDocument? indexFilter = null!, BsonDocument? sort = null!, BsonDocument? lookup = null!, BsonDocument? project = null!, int? limit = null!, int? skip = null!)
        {

            var query = _collection.Aggregate();

            // $search need to be the first stage in pipeline
            if (indexFilter is not null)
            {
                query = query.AppendStage<TEntity>(new BsonDocument {
                    {
                        "$search", indexFilter
                    }
                });
            }

            if (sort is not null)
            {
                query = query.Sort(sort);
            }

            if (filter is not null)
            {
                query = query.Match(filter);
            }

            if (skip is not null)
            {
                query = query.Skip(skip.Value);
            }

            if (limit is not null)
            {
                query = query.Limit(limit.Value);
            }

            if (lookup is not null)
            {
                query = query.AppendStage<TEntity>(new BsonDocument
                {
                    {
                        "$lookup", lookup
                    }
                });
            }

            if (project is not null)
            {
                query = query.AppendStage<TEntity>(new BsonDocument
                {
                    {
                        "$project", project
                    }
                });
            }

            long total = await _collection.CountDocumentsAsync(filter is null ? Builders<TEntity>.Filter.Empty : filter);
            var entities = await query.ToListAsync();
            return (total, entities);
        }

        public virtual async Task<bool> ReplaceOneAsync(string id, TEntity entity)
        {
            var rs = await _collection.ReplaceOneAsync(Builders<TEntity>.Filter.Eq("Id", id), entity);
            return rs.ModifiedCount > 0 ? true : false;
        }

        public virtual async Task<bool> DeleteOneAsync(string id)
        {
            var rs = await _collection.DeleteOneAsync(Builders<TEntity>.Filter.Eq("Id", id));
            return rs.DeletedCount > 0 ? true : false;
        }

        public virtual async Task<bool> SoftDelete(string[] listId, UpdateDefinition<TEntity> update = null!)
        {

            using var session = await _client.StartSessionAsync();
            try
            {
                session.StartTransaction();

                foreach (string id in listId)
                {
                    var rs = await _collection.FindOneAndUpdateAsync(session: session, Builders<TEntity>.Filter.Eq("Id", id), update);
                }

                await session.CommitTransactionAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                await session.AbortTransactionAsync();
                return false;
            }

            return true;
        }

        public virtual async Task<TEntity> FindOneAsync(FilterDefinition<TEntity> filter = null!)
        {
            var entity = await _collection.Find(filter is null ? Builders<TEntity>.Filter.Empty : filter).FirstOrDefaultAsync();
            return entity;
        }

        public virtual async Task<IClientSessionHandle> StartSessionAsync()
        {
            var session = await _client.StartSessionAsync();
            return session;
        }

        /// <summary>
        /// Release unmanage resources
        /// </summary>
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}