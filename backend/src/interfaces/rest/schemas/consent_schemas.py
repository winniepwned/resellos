"""Consent request/response schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ConsentGrantSchema(BaseModel):
    purpose: str = Field(..., pattern="^(analytics|marketing|third_party)$")


class ConsentResponseSchema(BaseModel):
    id: UUID
    purpose: str
    granted: bool
    granted_at: datetime | None
    revoked_at: datetime | None
    created_at: datetime


class ConsentListSchema(BaseModel):
    consents: list[ConsentResponseSchema]
