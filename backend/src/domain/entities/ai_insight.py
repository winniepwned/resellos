"""AI Insight domain entity."""
from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4


@dataclass
class AiInsight:
    """AI-generated insights for an item."""
    id: UUID = field(default_factory=uuid4)
    item_id: UUID = field(default_factory=uuid4)
    resell_score: int | None = None
    suggested_price_low: Decimal | None = None
    suggested_price_optimal: Decimal | None = None
    suggested_price_high: Decimal | None = None
    generated_title: str | None = None
    generated_description: str | None = None
    generated_hashtags: str | None = None
    market_reasoning: str | None = None
    competitor_count: int | None = None
    avg_market_price: Decimal | None = None
    demand_level: str | None = None
    stagnation_tips: str | None = None
    pipeline_version: str | None = None
    analyzed_at: datetime | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
