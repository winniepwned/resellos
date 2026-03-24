"""FastAPI application factory with lifespan management."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI

from src.config import settings
from src.interfaces.rest.middleware.cors import setup_cors
from src.interfaces.rest.middleware.error_handler import setup_error_handlers
from src.interfaces.rest.routes import router as api_router

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan: startup and shutdown events."""
    await logger.ainfo("Starting application", environment=settings.environment)

    from src.infrastructure.supabase.client import close_http_client
    from src.infrastructure.tasks.scheduler import scheduler, setup_scheduler

    setup_scheduler()
    scheduler.start()

    yield

    scheduler.shutdown()
    await close_http_client()
    await logger.ainfo("Shutting down application")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs" if settings.environment == "development" else None,
        redoc_url=None,
        lifespan=lifespan,
    )

    setup_cors(app)
    setup_error_handlers(app)
    app.include_router(api_router, prefix="/api/v1")

    return app


app = create_app()
