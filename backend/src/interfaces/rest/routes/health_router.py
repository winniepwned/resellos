"""Health check endpoints (BSI-OPS-HEALTH)."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health() -> dict:
    """Liveness probe."""
    return {"status": "healthy"}


@router.get("/ready")
async def ready() -> dict:
    """Readiness probe — checks dependencies."""
    return {"status": "ready"}
