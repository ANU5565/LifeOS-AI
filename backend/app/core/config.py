"""LifeOS AI — Application configuration via environment variables."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "postgresql+asyncpg://lifeos:lifeos_dev@localhost:5432/lifeos_db"

    # Security
    secret_key: str = "CHANGE-THIS-IN-PRODUCTION"
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"

    # AI
    gemini_api_key: str = ""

    # CORS
    cors_origins: str = "http://localhost:3000"

    model_config = {
        "env_file": (Path(__file__).resolve().parents[3] / ".env", ".env"),
        "env_file_encoding": "utf-8",
    }

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()
