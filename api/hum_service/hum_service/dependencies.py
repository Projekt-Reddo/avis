from .services.s3_service import S3Service

# region AWS S3

s3_service = S3Service("awss3demo")

# endregion


async def singleton_s3_service():
    return s3_service
