"""Supabase client singleton."""

from supabase import Client, create_client

from src.config import settings

_client: Client | None = None


def get_supabase_client() -> Client:
    """Get or create the Supabase client singleton."""
    global _client  # noqa: PLW0603
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_key)
    return _client
