"""Application configuration via Pydantic Settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    app_name: str = "fullstack-app"
    app_version: str = "0.1.0"
    environment: str = "development"
    port: int = 3000
    log_level: str = "info"

    # Supabase
    supabase_url: str = "https://xxxxx.supabase.co"
    supabase_service_key: str = ""
    supabase_jwt_secret: str = ""

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/myservice"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Rate Limiting
    rate_limit_requests_per_minute: int = 30

    # Celery
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    # Retention (DSGVO)
    retention_data_days: int = 365
    retention_logs_days: int = 30

    # CORS
    cors_origins: list[str] = ["http://localhost:8081"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
