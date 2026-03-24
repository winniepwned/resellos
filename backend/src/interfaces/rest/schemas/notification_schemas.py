"""Notification response schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class NotificationSchema(BaseModel):
    id: UUID
    type: str
    title: str
    message: str
    item_id: UUID | None
    is_read: bool
    action_url: str | None
    created_at: datetime


class NotificationListSchema(BaseModel):
    notifications: list[NotificationSchema]
    unread_count: int
