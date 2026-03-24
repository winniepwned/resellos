"""List notifications query."""

from uuid import UUID

from src.domain.entities.notification import Notification
from src.domain.repositories.notification_repository import NotificationRepository


class ListNotificationsQuery:
    def __init__(self, user_id: UUID, unread_only: bool = False) -> None:
        self.user_id = user_id
        self.unread_only = unread_only


class ListNotificationsHandler:
    def __init__(self, notification_repo: NotificationRepository) -> None:
        self._notification_repo = notification_repo

    async def handle(self, query: ListNotificationsQuery) -> list[Notification]:
        return await self._notification_repo.get_by_user_id(
            query.user_id, query.unread_only
        )
