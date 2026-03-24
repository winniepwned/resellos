"""Sourcing request/response schemas."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class SourcingStartSchema(BaseModel):
    keyword: str = Field(..., max_length=500)
    image_url: str | None = None


class SourcingStatusSchema(BaseModel):
    task_id: str
    status: str
    pipeline_steps: dict | None = None


class SourcingResultSchema(BaseModel):
    id: UUID
    task_id: str
    status: str
    input_keyword: str | None
    detected_brand: str | None
    detected_category: str | None
    resell_score: int | None
    estimated_profit_low: Decimal | None
    estimated_profit_high: Decimal | None
    market_reasoning: str | None
    recommendation: str | None
    pipeline_steps: dict | None
    created_at: datetime
    completed_at: datetime | None
