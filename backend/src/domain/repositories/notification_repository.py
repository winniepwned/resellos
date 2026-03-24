"""Abstract notification repository."""
from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.notification import Notification


class NotificationRepository(ABC):
    @abstractmethod
    async def get_by_user_id(
        self, user_id: UUID, unread_only: bool = False,
    ) -> list[Notification]: ...

    @abstractmethod
    async def save(self, notification: Notification) -> Notification: ...

    @abstractmethod
    async def mark_read(self, notification_id: UUID) -> None: ...
