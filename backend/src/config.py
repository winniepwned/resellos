"""Application configuration via Pydantic Settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    app_name: str = "resellos-backend"
    app_version: str = "1.0.0"
    environment: str = "development"
    port: int = 8000
    log_level: str = "info"

    # Supabase
    supabase_url: str = "https://xxxxx.supabase.co"
    supabase_service_key: str = ""
    supabase_jwt_secret: str = ""

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/resellos"

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

    # Perplexity Search API
    perplexity_api_key: str = ""
    perplexity_search_url: str = "https://api.perplexity.ai/search"
    perplexity_search_max_results: int = 10
    perplexity_search_country: str = "DE"
    perplexity_search_recency: str = "month"
    perplexity_search_domains: list[str] = [
        "vinted.de",
        "vinted.fr",
        "vinted.com",
        "ebay-kleinanzeigen.de",
        "ebay.de",
        "vestiairecollective.com",
    ]
    perplexity_search_rate_limit_per_min: int = 50

    # Perplexity Sonar API
    perplexity_sonar_url: str = "https://api.perplexity.ai/chat/completions"
    perplexity_sonar_model: str = "sonar"
    perplexity_sonar_search_context_size: str = "low"

    # ResellOS
    dead_stock_threshold_days: int = 30
    sourcing_result_retention_days: int = 7
    default_platform_tonality: str = "vinted"
    platform_fees: dict[str, float] = {
        "vinted": 0.05,
        "kleinanzeigen": 0.0,
        "ebay": 0.11,
    }

    # CORS
    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = {
        "env_file": "../.env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
