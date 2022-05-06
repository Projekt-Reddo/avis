using Amazon.S3;
using Amazon.S3.Model;

namespace MainService.Services
{
    public interface IS3Service
    {
        Task<bool> DoesBucketExistsAsync(string bucketName);
        Task<Stream?> DownloadFileAsync(string bucketName, string? folder, string fileName);
        Task<bool> UploadFileAsync(string bucketName, string? folder, string fileName, Stream fileStream, string contentType);
    }

    /// <summary>
    /// AWS S3 service
    /// </summary>
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;

        public S3Service(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        /// <summary>
        /// Check if a Bucket exists
        /// </summary>
        /// <param name="bucketName"></param>
        /// <returns>True (Existed) / False (Not existed)</returns>
        public async Task<bool> DoesBucketExistsAsync(string bucketName)
        {
            return await _s3Client.DoesS3BucketExistAsync(bucketName);
        }

        /// <summary>
        /// Download a file from S3 using the file name
        /// </summary>
        /// <param name="bucketName"></param>
        /// <param name="folder"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public async Task<Stream?> DownloadFileAsync(string bucketName, string? folder, string fileName)
        {
            // Get the file from S3
            var key = String.IsNullOrEmpty(folder) ? fileName : $"{folder}/{fileName}";

            var request = new GetObjectRequest
            {
                BucketName = bucketName,
                Key = key
            };

            var response = await _s3Client.GetObjectAsync(request);

            // Return the file stream
            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
            {
                return null;
            }

            return response.ResponseStream;
        }

        /// <summary>
        /// Upload a stream to S3
        /// </summary>
        /// <param name="bucketName"></param>
        /// <param name="folder"></param>
        /// <param name="fileName"></param>
        /// <param name="fileStream"></param>
        /// <param name="contentType"></param>
        /// <returns>True (Upload done) / False (Fail to upload)</returns>
        public async Task<bool> UploadFileAsync(string bucketName, string? folder, string fileName, Stream fileStream, string contentType)
        {
            // Upload the file to S3
            var key = String.IsNullOrEmpty(folder) ? fileName : $"{folder}/{fileName}";

            var request = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = key,
                InputStream = fileStream,
                ContentType = contentType
            };

            var result = await _s3Client.PutObjectAsync(request);

            // Return the result
            return result.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }
    }
}