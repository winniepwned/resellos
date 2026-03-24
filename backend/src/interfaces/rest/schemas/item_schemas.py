"""Item request/response schemas."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class ItemCreateSchema(BaseModel):
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


class ItemUpdateSchema(BaseModel):
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


class MarkSoldSchema(BaseModel):
    sold_price: Decimal = Field(..., ge=0, decimal_places=2)
    sold_at: datetime | None = None


class MarkListedSchema(BaseModel):
    platform: str = Field(..., max_length=100)
    listed_at: datetime | None = None


class ItemResponseSchema(BaseModel):
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


class ItemListResponseSchema(BaseModel):
    items: list[ItemResponseSchema]
    next_cursor: str | None
