"""PostgREST-based notification repository."""

from uuid import UUID

from src.domain.entities.notification import Notification
from src.domain.repositories.notification_repository import NotificationRepository
from src.infrastructure.supabase.client import (
    get_http_client,
    parse_datetime,
    parse_uuid,
    postgrest_headers,
    to_json_val,
)


def _to_entity(row: dict) -> Notification:
    return Notification(
        id=UUID(row["id"]),
        user_id=UUID(row["user_id"]),
        type=row.get("type", "tip"),
        title=row.get("title", ""),
        message=row.get("message", ""),
        item_id=parse_uuid(row.get("item_id")),
        is_read=row.get("is_read", False),
        action_url=row.get("action_url"),
        created_at=parse_datetime(row.get("created_at")) or Notification().created_at,
    )


class PostgRESTNotificationRepository(NotificationRepository):
    """Notification repository using Supabase PostgREST API."""

    def __init__(self, token: str) -> None:
        self._headers = postgrest_headers(token)
        self._client = get_http_client()

    async def get_by_user_id(
        self, user_id: UUID, unread_only: bool = False
    ) -> list[Notification]:
        params: dict[str, str] = {
            "user_id": f"eq.{user_id}",
            "select": "*",
            "order": "created_at.desc",
        }
        if unread_only:
            params["is_read"] = "eq.false"

        response = await self._client.get("/notifications", params=params, headers=self._headers)
        response.raise_for_status()
        return [_to_entity(r) for r in response.json()]

    async def save(self, notification: Notification) -> Notification:
        data = {
            "id": to_json_val(notification.id),
            "user_id": to_json_val(notification.user_id),
            "type": notification.type,
            "title": notification.title,
            "message": notification.message,
            "item_id": to_json_val(notification.item_id),
            "is_read": notification.is_read,
            "action_url": notification.action_url,
        }
        response = await self._client.post("/notifications", json=data, headers=self._headers)
        response.raise_for_status()
        return notification

    async def mark_read(self, notification_id: UUID) -> None:
        response = await self._client.patch(
            "/notifications",
            params={"id": f"eq.{notification_id}"},
            json={"is_read": True},
            headers=self._headers,
        )
        response.raise_for_status()
