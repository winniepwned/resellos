"""Item data transfer objects."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class ItemCreateRequest(BaseModel):
    title: str = Field(..., max_length=500)
    brand: str = Field(..., max_length=255)
    category: str | None = Field(None, max_length=255)
    size: str | None = Field(None, max_length=100)
    condition: str = Field("good", pattern="^(new|like_new|good|fair)$")
    color: str | None = Field(None, max_length=100)
    purchase_price_ek: Decimal = Field(..., ge=0, decimal_places=2)
    platform: str | None = Field(None, max_length=100)
    notes: str | None = None
    images: list[str] = Field(default_factory=list)


class ItemUpdateRequest(BaseModel):
    title: str | None = Field(None, max_length=500)
    brand: str | None = Field(None, max_length=255)
    category: str | None = Field(None, max_length=255)
    size: str | None = Field(None, max_length=100)
    condition: str | None = Field(None, pattern="^(new|like_new|good|fair)$")
    color: str | None = Field(None, max_length=100)
    purchase_price_ek: Decimal | None = Field(None, ge=0)
    target_price: Decimal | None = Field(None, ge=0)
    platform: str | None = Field(None, max_length=100)
    notes: str | None = None
    images: list[str] | None = None


class MarkSoldRequest(BaseModel):
    sold_price: Decimal = Field(..., ge=0, decimal_places=2)
    sold_at: datetime | None = None


class MarkListedRequest(BaseModel):
    platform: str = Field(..., max_length=100)
    listed_at: datetime | None = None


class ItemResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    brand: str
    category: str | None
    size: str | None
    condition: str
    color: str | None
    purchase_price_ek: Decimal
    target_price: Decimal | None
    sold_price: Decimal | None
    status: str
    platform: str | None
    notes: str | None
    images: list[str]
    listed_at: datetime | None
    sold_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ItemListResponse(BaseModel):
    items: list[ItemResponse]
    next_cursor: str | None
