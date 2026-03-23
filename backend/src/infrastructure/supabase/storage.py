"""Supabase storage utilities."""

from src.infrastructure.supabase.client import get_supabase_client


async def upload_file(bucket: str, path: str, file_data: bytes) -> str:
    """Upload a file to Supabase Storage."""
    client = get_supabase_client()
    client.storage.from_(bucket).upload(path, file_data)
    return client.storage.from_(bucket).get_public_url(path)


async def delete_file(bucket: str, path: str) -> None:
    """Delete a file from Supabase Storage."""
    client = get_supabase_client()
    client.storage.from_(bucket).remove([path])
