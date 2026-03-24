"""Sourcing result ORM model."""
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.infrastructure.database.models.base import Base


class SourcingResultModel(Base):
    """Sourcing result database model."""
    __tablename__ = "sourcing_results"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    task_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")
    input_keyword: Mapped[str | None] = mapped_column(String(500), nullable=True)
    input_image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    detected_brand: Mapped[str | None] = mapped_column(String(255), nullable=True)
    detected_category: Mapped[str | None] = mapped_column(String(255), nullable=True)
    resell_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    estimated_profit_low: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    estimated_profit_high: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    market_reasoning: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommendation: Mapped[str | None] = mapped_column(String(50), nullable=True)
    pipeline_steps: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(),
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
