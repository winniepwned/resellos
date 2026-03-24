"""SQLAlchemy notification repository implementation."""

from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.notification import Notification
from src.domain.repositories.notification_repository import NotificationRepository
from src.infrastructure.database.models.notification_model import NotificationModel


class SqlAlchemyNotificationRepository(NotificationRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: NotificationModel) -> Notification:
        return Notification(
            id=model.id,
            user_id=model.user_id,
            type=model.type,
            title=model.title,
            message=model.message,
            item_id=model.item_id,
            is_read=model.is_read,
            action_url=model.action_url,
            created_at=model.created_at,
        )

    async def get_by_user_id(
        self, user_id: UUID, unread_only: bool = False
    ) -> list[Notification]:
        stmt = select(NotificationModel).where(NotificationModel.user_id == user_id)
        if unread_only:
            stmt = stmt.where(NotificationModel.is_read.is_(False))
        stmt = stmt.order_by(NotificationModel.created_at.desc())
        result = await self._session.execute(stmt)
        return [self._to_entity(m) for m in result.scalars().all()]

    async def save(self, notification: Notification) -> Notification:
        model = NotificationModel(
            id=notification.id,
            user_id=notification.user_id,
            type=notification.type,
            title=notification.title,
            message=notification.message,
            item_id=notification.item_id,
            is_read=notification.is_read,
            action_url=notification.action_url,
        )
        self._session.add(model)
        await self._session.commit()
        return notification

    async def mark_read(self, notification_id: UUID) -> None:
        stmt = (
            update(NotificationModel)
            .where(NotificationModel.id == notification_id)
            .values(is_read=True)
        )
        await self._session.execute(stmt)
        await self._session.commit()
