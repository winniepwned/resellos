"""Analytics/Dashboard routes."""

from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends

from src.infrastructure.supabase.repositories.postgrest_item_repository import (
    PostgRESTItemRepository,
)
from src.interfaces.rest.dependencies.auth import get_token, get_user_id

router = APIRouter()


@router.get("/overview")
async def get_overview(
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Financial overview: profit, ROI, avg profit."""
    repo = PostgRESTItemRepository(token)
    sold_items, _ = await repo.get_by_user_id(user_id, status="sold", limit=1000)
    active_items, _ = await repo.get_by_user_id(user_id, limit=1000)
    active_count = len([i for i in active_items if i.status not in ("sold", "archived")])

    total_revenue = sum((i.sold_price or Decimal("0")) for i in sold_items)
    total_investment = sum(i.purchase_price_ek for i in sold_items)
    total_profit = total_revenue - total_investment
    items_sold = len(sold_items)
    avg_profit = total_profit / items_sold if items_sold > 0 else Decimal("0")
    roi = (total_profit / total_investment * 100) if total_investment > 0 else Decimal("0")

    return {
        "total_profit": float(total_profit),
        "total_revenue": float(total_revenue),
        "total_investment": float(total_investment),
        "roi_percent": float(roi),
        "avg_profit_per_item": float(avg_profit),
        "items_sold": items_sold,
        "items_active": active_count,
    }


@router.get("/inventory")
async def get_inventory_health(
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Inventory health: capital invested, expected revenue/profit."""
    repo = PostgRESTItemRepository(token)
    items, _ = await repo.get_by_user_id(user_id, limit=1000)
    active = [i for i in items if i.deleted_at is None and i.status != "sold"]

    total_capital = sum(i.purchase_price_ek for i in active)
    expected_revenue = sum((i.target_price or i.purchase_price_ek) for i in active)
    expected_profit = expected_revenue - total_capital

    status_counts: dict[str, int] = {}
    for item in active:
        status_counts[item.status] = status_counts.get(item.status, 0) + 1

    return {
        "total_items": len(active),
        "total_capital_invested": float(total_capital),
        "expected_revenue": float(expected_revenue),
        "expected_profit": float(expected_profit),
        "items_by_status": status_counts,
    }


@router.get("/brands")
async def get_brand_performance(
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Brand & category performance."""
    repo = PostgRESTItemRepository(token)
    sold_items, _ = await repo.get_by_user_id(user_id, status="sold", limit=1000)

    brand_data: dict[str, dict] = {}
    for item in sold_items:
        if item.brand not in brand_data:
            brand_data[item.brand] = {
                "items_count": 0,
                "total_profit": Decimal("0"),
                "total_days": 0,
            }
        profit = (item.sold_price or Decimal("0")) - item.purchase_price_ek
        brand_data[item.brand]["items_count"] += 1
        brand_data[item.brand]["total_profit"] += profit
        if item.sold_at and item.created_at:
            days = (item.sold_at - item.created_at).days
            brand_data[item.brand]["total_days"] += days

    brands = []
    for brand, data in brand_data.items():
        count = data["items_count"]
        brands.append({
            "brand": brand,
            "items_count": count,
            "total_profit": float(data["total_profit"]),
            "avg_profit": float(data["total_profit"] / count) if count > 0 else 0.0,
            "avg_days_to_sell": data["total_days"] / count if count > 0 else 0.0,
        })

    return {"brands": sorted(brands, key=lambda x: x["total_profit"], reverse=True)}


@router.get("/sell-through")
async def get_sell_through_rate(
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Sell-through rate."""
    repo = PostgRESTItemRepository(token)
    all_items, _ = await repo.get_by_user_id(user_id, limit=1000)

    sold = len([i for i in all_items if i.status == "sold"])
    listed = len([i for i in all_items if i.status in ("listed", "sold")])
    rate = (sold / listed * 100) if listed > 0 else 0.0

    return {
        "rate_percent": rate,
        "items_sold": sold,
        "items_listed": listed,
        "period_days": 30,
    }


@router.get("/dead-stock")
async def get_dead_stock(
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Dead-stock items with AI tips."""
    repo = PostgRESTItemRepository(token)
    items, _ = await repo.get_by_user_id(user_id, limit=1000)

    from datetime import UTC, datetime

    from src.domain.services.dead_stock_detector import DeadStockDetector

    detector = DeadStockDetector(threshold_days=30)
    dead_items = detector.detect(items)

    total_locked = sum(i.purchase_price_ek for i in dead_items)
    result_items = []
    for item in dead_items:
        ref_date = item.listed_at or item.created_at
        days = (datetime.now(UTC) - ref_date).days
        result_items.append({
            "item_id": str(item.id),
            "title": item.title,
            "brand": item.brand,
            "days_stagnating": days,
            "purchase_price": float(item.purchase_price_ek),
            "ai_tip": None,
        })

    return {"items": result_items, "total_capital_locked": float(total_locked)}
