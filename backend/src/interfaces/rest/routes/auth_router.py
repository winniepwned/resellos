"""Authentication routes (Supabase Auth passthrough)."""

from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
async def login() -> dict:
    """Login via Supabase Auth. Frontend handles this directly."""
    return {"message": "Use Supabase Auth client-side. This endpoint is for server-side flows."}


@router.post("/refresh")
async def refresh_token() -> dict:
    """Refresh JWT token."""
    return {"message": "Use Supabase Auth client-side for token refresh."}
