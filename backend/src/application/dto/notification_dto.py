"""Notification data transfer objects."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: UUID
    type: str
    title: str
    message: str
    item_id: UUID | None
    is_read: bool
    action_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationListResponse(BaseModel):
    notifications: list[NotificationResponse]
    unread_count: int
