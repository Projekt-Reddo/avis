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


class DevSettings(Settings):
    aws_profile: str = "awss3demo"


class StagingSettings(Settings):
    aws_profile: str = None


class ProductionSettings(Settings):
    aws_profile: str = None


def get_settings():
    env = os.environ.get("FAST_ENV", None)
    if env == "Production":
        return ProductionSettings()
    elif env == "Staging":
        return StagingSettings()
    return DevSettings()


config = get_settings()
