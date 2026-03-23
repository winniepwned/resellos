"""Product routes — Open Food Facts integration."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/{barcode}")
async def get_product(barcode: str) -> dict:
    """Get product by barcode from Open Food Facts."""
    return {"barcode": barcode, "product": None}


@router.get("")
async def search_products(q: str = "", page: int = 1) -> dict:
    """Search products."""
    return {"query": q, "page": page, "results": []}
