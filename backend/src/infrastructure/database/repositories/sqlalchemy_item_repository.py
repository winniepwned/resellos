"""SQLAlchemy item repository implementation."""

import uuid
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.item import Item
from src.domain.repositories.item_repository import ItemRepository
from src.infrastructure.database.models.item_model import ItemModel


class SqlAlchemyItemRepository(ItemRepository):
    """Concrete item repository using SQLAlchemy."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: ItemModel) -> Item:
        return Item(
            id=model.id,
            user_id=model.user_id,
            title=model.title,
            brand=model.brand,
            category=model.category,
            size=model.size,
            condition=model.condition,
            color=model.color,
            purchase_price_ek=model.purchase_price_ek,
            target_price=model.target_price,
            sold_price=model.sold_price,
            status=model.status,
            platform=model.platform,
            notes=model.notes,
            images=model.images or [],
            listed_at=model.listed_at,
            sold_at=model.sold_at,
            created_at=model.created_at,
            updated_at=model.updated_at,
            deleted_at=model.deleted_at,
        )

    async def get_by_id(self, item_id: UUID) -> Item | None:
        stmt = select(ItemModel).where(ItemModel.id == item_id, ItemModel.deleted_at.is_(None))
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_by_user_id(
        self,
        user_id: UUID,
        status: str | None = None,
        cursor: str | None = None,
        limit: int = 20,
    ) -> tuple[list[Item], str | None]:
        stmt = select(ItemModel).where(
            ItemModel.user_id == user_id,
            ItemModel.deleted_at.is_(None),
        )
        if status:
            stmt = stmt.where(ItemModel.status == status)
        if cursor:
            stmt = stmt.where(ItemModel.id < uuid.UUID(cursor))
        stmt = stmt.order_by(ItemModel.created_at.desc()).limit(limit + 1)

        result = await self._session.execute(stmt)
        models = list(result.scalars().all())

        next_cursor = None
        if len(models) > limit:
            next_cursor = str(models[limit - 1].id)
            models = models[:limit]

        return [self._to_entity(m) for m in models], next_cursor

    async def save(self, item: Item) -> Item:
        stmt = select(ItemModel).where(ItemModel.id == item.id)
        result = await self._session.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            existing.title = item.title
            existing.brand = item.brand
            existing.category = item.category
            existing.size = item.size
            existing.condition = item.condition
            existing.color = item.color
            existing.purchase_price_ek = item.purchase_price_ek
            existing.target_price = item.target_price
            existing.sold_price = item.sold_price
            existing.status = item.status
            existing.platform = item.platform
            existing.notes = item.notes
            existing.images = item.images
            existing.listed_at = item.listed_at
            existing.sold_at = item.sold_at
            existing.deleted_at = item.deleted_at
        else:
            model = ItemModel(
                id=item.id,
                user_id=item.user_id,
                title=item.title,
                brand=item.brand,
                category=item.category,
                size=item.size,
                condition=item.condition,
                color=item.color,
                purchase_price_ek=item.purchase_price_ek,
                target_price=item.target_price,
                sold_price=item.sold_price,
                status=item.status,
                platform=item.platform,
                notes=item.notes,
                images=item.images,
                listed_at=item.listed_at,
                sold_at=item.sold_at,
            )
            self._session.add(model)

        await self._session.commit()
        return item

    async def delete(self, item_id: UUID) -> None:
        stmt = select(ItemModel).where(ItemModel.id == item_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.commit()
