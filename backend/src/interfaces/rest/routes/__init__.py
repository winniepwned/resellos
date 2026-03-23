"""API route aggregation."""

from fastapi import APIRouter

from src.interfaces.rest.routes.auth_router import router as auth_router
from src.interfaces.rest.routes.health_router import router as health_router
from src.interfaces.rest.routes.product_router import router as product_router
from src.interfaces.rest.routes.user_router import router as user_router

router = APIRouter()
router.include_router(health_router, tags=["health"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(user_router, prefix="/me", tags=["user"])
router.include_router(product_router, prefix="/products", tags=["products"])
