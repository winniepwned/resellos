"""Create item command and handler."""

from decimal import Decimal
from uuid import UUID

from src.domain.entities.item import Item
from src.domain.repositories.item_repository import ItemRepository


class CreateItemCommand:
    def __init__(
        self,
        user_id: UUID,
        title: str,
        brand: str,
        purchase_price_ek: Decimal,
        condition: str = "good",
        category: str | None = None,
        size: str | None = None,
        color: str | None = None,
        platform: str | None = None,
        notes: str | None = None,
        images: list[str] | None = None,
    ) -> None:
        self.user_id = user_id
        self.title = title
        self.brand = brand
        self.purchase_price_ek = purchase_price_ek
        self.condition = condition
        self.category = category
        self.size = size
        self.color = color
        self.platform = platform
        self.notes = notes
        self.images = images or []


class CreateItemHandler:
    def __init__(self, item_repo: ItemRepository) -> None:
        self._item_repo = item_repo

    async def handle(self, command: CreateItemCommand) -> Item:
        item = Item(
            user_id=command.user_id,
            title=command.title,
            brand=command.brand,
            purchase_price_ek=command.purchase_price_ek,
            condition=command.condition,
            category=command.category,
            size=command.size,
            color=command.color,
            platform=command.platform,
            notes=command.notes,
            images=command.images,
            status="draft",
        )
        return await self._item_repo.save(item)
