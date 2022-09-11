import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = "hum-service"
    api_prefix: str = "/api"
    origins: list = [
        "http://localhost:3000",  # React dev
        "https://localhost:7179",  # Dotnet dev https
        "http://localhost:5253"  # Dotnet dev http
    ]
    ckpt_folder: str = "ckpt"
    faiss_folder: str = "faiss"


class DevSettings(Settings):
    aws_profile: str = "avis"
    song_bucket: str = "dev.songs-bucket"
    ml_bucket: str = "dev.ml-bucket"


class StagingSettings(Settings):
    aws_profile: str = None
    song_bucket: str = "staging.songs-bucket"
    ml_bucket: str = "staging.ml-bucket"


class ProductionSettings(Settings):
    aws_profile: str = None
    song_bucket: str = "pro.songs-bucket"
    ml_bucket: str = "pro.ml-bucket"


def get_settings():
    env = os.environ.get("FAST_ENV", None)
    if env == "Production":
        return ProductionSettings()
    elif env == "Staging":
        return StagingSettings()
    return DevSettings()


config = get_settings()
