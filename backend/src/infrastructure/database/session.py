"""Async database session management.

NOTE: Direct database access via SQLAlchemy is no longer used at runtime.
The application now uses Supabase PostgREST API via the repositories in
src/infrastructure/supabase/repositories/. This module is kept for reference
and potential future use (e.g., migrations, batch jobs).
"""

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.config import settings

_engine = None
_session_factory = None


def _init() -> None:
    global _engine, _session_factory  # noqa: PLW0603
    if _engine is None:
        _engine = create_async_engine(
            settings.database_url,
            echo=settings.environment == "development",
            pool_size=5,
            max_overflow=10,
        )
        _session_factory = async_sessionmaker(
            _engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )


async def get_session() -> AsyncIterator[AsyncSession]:
    """Yield an async database session (lazy-initialized)."""
    _init()
    if _session_factory is None:
        msg = "Database session factory not initialized"
        raise RuntimeError(msg)
    async with _session_factory() as session:
        yield session
