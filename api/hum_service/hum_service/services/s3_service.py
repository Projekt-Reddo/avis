import os
import boto3
from botocore.exceptions import ClientError


class S3Service:

    def __init__(self, profile="awss3demo"):
        """Create an S3 service with the given profile

        :param profile: AWS profile name
        """

        self.profile = profile

        AWS_ACEESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
        AWS_REGION = os.environ.get("AWS_REGION")

        if (AWS_ACEESS_KEY_ID is None or AWS_SECRET_ACCESS_KEY is None or AWS_REGION is None):
            self.s3 = boto3.Session(profile_name=profile).resource('s3')
            print("AWS connection created using profile: " + profile)
        else:
            self.s3 = boto3.resource("s3",
                                     aws_access_key_id=AWS_ACEESS_KEY_ID,
                                     aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                                     region_name=AWS_REGION
                                     )
            print("AWS connection created using credentials")

    def upload_file(self, bucket_name: str, prefix: str, file_name: str, file):
        """Upload a file to an S3 bucket

        :param bucket_name: Bucket to upload to
        :param prefix: Folder in the bucket to upload to
        :param file_name: File name to save if not provided name in the file will be used
        :param file: File to upload
        :return: True if file was uploaded, else False
        """

        try:
            # Reformat name
            file_name = file_name.replace("/", "").replace(" ", "").strip()
            bucket_name = bucket_name.replace("/", "").replace(" ", "").strip()
            prefix = prefix.replace("/", "").replace(" ", "").strip()

            # Upload the file
            self.s3.Bucket(bucket_name).upload_fileobj(
                file, prefix + "/" + file_name)
        except ClientError as e:
            print(e)
            return False

        return True

    def download_file(self, bucket_name: str, prefix: str, file_name: str, target_dir: str):
        """Download a file from an S3 bucket

        :param bucket_name: Bucket to download from
        :param prefix: Folder in the bucket to download from
        :param file_name: File to download
        :param target_dir: Folder to save downloaded file
        :return: True if file was downloaded, else False
        """

        try:
            file_name = file_name.replace("/", "").replace(" ", "").strip()
            bucket_name = bucket_name.replace("/", "").replace(" ", "").strip()
            prefix = prefix.replace("/", "").replace(" ", "").strip()
            target_dir = target_dir.replace(" ", "").strip().strip("/")

            # Download the file
            self.s3.Bucket(bucket_name).download_file(
                prefix + "/" + file_name, target_dir + "/" + file_name)

        except ClientError as e:
            print(e)
            return False

        return True
