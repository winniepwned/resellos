"""Supabase PostgREST client utilities."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

import httpx

from src.config import settings

_client: httpx.AsyncClient | None = None


def get_http_client() -> httpx.AsyncClient:
    """Get or create a shared async HTTP client for PostgREST calls."""
    global _client  # noqa: PLW0603
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(
            base_url=f"{settings.supabase_url}/rest/v1",
            timeout=30.0,
        )
    return _client


async def close_http_client() -> None:
    """Close the shared HTTP client (call on shutdown)."""
    global _client  # noqa: PLW0603
    if _client and not _client.is_closed:
        await _client.aclose()
        _client = None


def postgrest_headers(token: str, *, prefer: str = "return=representation") -> dict[str, str]:
    """Build PostgREST request headers with user auth token."""
    return {
        "apikey": settings.supabase_service_key,
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": prefer,
    }


def to_json_val(val: object) -> object:
    """Convert Python types to JSON-safe values for PostgREST."""
    if val is None:
        return None
    if isinstance(val, UUID):
        return str(val)
    if isinstance(val, Decimal):
        return float(val)
    if isinstance(val, datetime):
        return val.isoformat()
    return val


def parse_uuid(val: str | None) -> UUID | None:
    """Parse a UUID string to UUID object."""
    return UUID(val) if val else None


def parse_decimal(val: object) -> Decimal | None:
    """Parse a numeric value to Decimal."""
    if val is None:
        return None
    return Decimal(str(val))


def parse_datetime(val: str | None) -> datetime | None:
    """Parse an ISO 8601 string to datetime."""
    if val is None:
        return None
    return datetime.fromisoformat(val)
