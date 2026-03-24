"""Supabase JWT authentication utilities."""

import httpx

from src.config import settings


async def verify_supabase_token(token: str) -> dict | None:
    """Verify a Supabase JWT by calling Supabase Auth API."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.supabase_service_key,
                },
                timeout=10.0,
            )
        if response.status_code != 200:
            return None
        user = response.json()
        return {"sub": user["id"], "email": user.get("email")}
    except Exception:
        return None
