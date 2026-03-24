"""AI Insight data transfer objects."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class InsightResponse(BaseModel):
    id: UUID
    item_id: UUID
    resell_score: int | None
    suggested_price_low: Decimal | None
    suggested_price_optimal: Decimal | None
    suggested_price_high: Decimal | None
    generated_title: str | None
    generated_description: str | None
    generated_hashtags: str | None
    market_reasoning: str | None
    competitor_count: int | None
    avg_market_price: Decimal | None
    demand_level: str | None
    stagnation_tips: str | None
    analyzed_at: datetime | None

    model_config = {"from_attributes": True}
