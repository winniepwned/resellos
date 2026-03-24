"""Sourcing result domain entity."""
from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4


@dataclass
class SourcingResult:
    """Temporary sourcing pipeline result."""
    id: UUID = field(default_factory=uuid4)
    user_id: UUID = field(default_factory=uuid4)
    task_id: str = ""
    status: str = "pending"
    input_keyword: str | None = None
    input_image_url: str | None = None
    detected_brand: str | None = None
    detected_category: str | None = None
    resell_score: int | None = None
    estimated_profit_low: Decimal | None = None
    estimated_profit_high: Decimal | None = None
    market_reasoning: str | None = None
    recommendation: str | None = None
    pipeline_steps: dict | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: datetime | None = None
