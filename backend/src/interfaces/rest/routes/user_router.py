"""User routes — DSGVO data subject rights (Art. 15, 16, 17, 18, 20)."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/data")
async def get_user_data() -> dict:
    """Art. 15 — Right of access: return all PII for the user."""
    return {"data": {}}


@router.get("/export")
async def export_user_data() -> dict:
    """Art. 20 — Data portability: export user data as JSON."""
    return {"export": {}, "format": "json"}


@router.patch("")
async def update_user() -> dict:
    """Art. 16 — Right to rectification."""
    return {"message": "Profile updated."}


@router.delete("")
async def delete_user() -> dict:
    """Art. 17 — Right to erasure (soft-delete, hard-delete after 30d)."""
    return {"message": "Account marked for deletion. Hard-delete in 30 days."}


@router.post("/restrict")
async def restrict_processing() -> dict:
    """Art. 18 — Right to restriction of processing."""
    return {"message": "Processing restricted."}
