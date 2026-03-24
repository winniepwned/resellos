"""Analytics data transfer objects."""

from decimal import Decimal

from pydantic import BaseModel


class OverviewResponse(BaseModel):
    total_profit: Decimal
    total_revenue: Decimal
    total_investment: Decimal
    roi_percent: Decimal
    avg_profit_per_item: Decimal
    items_sold: int
    items_active: int


class InventoryHealthResponse(BaseModel):
    total_items: int
    total_capital_invested: Decimal
    expected_revenue: Decimal
    expected_profit: Decimal
    items_by_status: dict[str, int]


class BrandPerformanceEntry(BaseModel):
    brand: str
    items_count: int
    total_profit: Decimal
    avg_profit: Decimal
    avg_days_to_sell: float


class BrandPerformanceResponse(BaseModel):
    brands: list[BrandPerformanceEntry]


class SellThroughResponse(BaseModel):
    rate_percent: Decimal
    items_sold: int
    items_listed: int
    period_days: int


class DeadStockItemResponse(BaseModel):
    item_id: str
    title: str
    brand: str
    days_stagnating: int
    purchase_price: Decimal
    ai_tip: str | None


class DeadStockResponse(BaseModel):
    items: list[DeadStockItemResponse]
    total_capital_locked: Decimal
