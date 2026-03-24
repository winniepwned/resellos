"""Notification / Action Center routes."""

from uuid import UUID

from fastapi import APIRouter, Depends

from src.infrastructure.supabase.repositories.postgrest_notification_repository import (
    PostgRESTNotificationRepository,
)
from src.interfaces.rest.dependencies.auth import get_token, get_user_id

router = APIRouter()


@router.get("")
async def list_notifications(
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """List all notifications for the current user."""
    repo = PostgRESTNotificationRepository(token)
    all_notifs = await repo.get_by_user_id(user_id)
    unread = await repo.get_by_user_id(user_id, unread_only=True)

    return {
        "notifications": [
            {
                "id": n.id,
                "type": n.type,
                "title": n.title,
                "message": n.message,
                "item_id": n.item_id,
                "is_read": n.is_read,
                "action_url": n.action_url,
                "created_at": n.created_at,
            }
            for n in all_notifs
        ],
        "unread_count": len(unread),
    }


@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Mark a notification as read."""
    repo = PostgRESTNotificationRepository(token)
    await repo.mark_read(notification_id)
    return {"message": "Notification marked as read."}
