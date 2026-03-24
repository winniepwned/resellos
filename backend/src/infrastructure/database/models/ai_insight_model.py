"""AI Insight ORM model."""
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.infrastructure.database.models.base import Base


class AiInsightModel(Base):
    """AI insight database model."""
    __tablename__ = "ai_insights"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
    )
    item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, unique=True, index=True,
    )
    resell_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    suggested_price_low: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    suggested_price_optimal: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    suggested_price_high: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    generated_title: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_hashtags: Mapped[str | None] = mapped_column(Text, nullable=True)
    market_reasoning: Mapped[str | None] = mapped_column(Text, nullable=True)
    competitor_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    avg_market_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    demand_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    stagnation_tips: Mapped[str | None] = mapped_column(Text, nullable=True)
    pipeline_version: Mapped[str | None] = mapped_column(String(50), nullable=True)
    analyzed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
        server_default=func.now(), onupdate=func.now(),
    )
