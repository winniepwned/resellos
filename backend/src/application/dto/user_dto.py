"""User data transfer objects."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    """User response DTO."""

    id: UUID
    email: str
    display_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
