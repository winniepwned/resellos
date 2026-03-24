"""API route aggregation."""

from fastapi import APIRouter

from src.interfaces.rest.routes.analytics_router import router as analytics_router
from src.interfaces.rest.routes.auth_router import router as auth_router
from src.interfaces.rest.routes.consent_router import router as consent_router
from src.interfaces.rest.routes.health_router import router as health_router
from src.interfaces.rest.routes.item_router import router as item_router
from src.interfaces.rest.routes.notification_router import router as notification_router
from src.interfaces.rest.routes.sourcing_router import router as sourcing_router
from src.interfaces.rest.routes.user_router import router as user_router

router = APIRouter()
router.include_router(health_router, tags=["health"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(user_router, prefix="/me", tags=["user"])
router.include_router(item_router, prefix="/items", tags=["items"])
router.include_router(sourcing_router, prefix="/sourcing", tags=["sourcing"])
router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
router.include_router(notification_router, prefix="/notifications", tags=["notifications"])
router.include_router(consent_router, prefix="/consent", tags=["consent"])
