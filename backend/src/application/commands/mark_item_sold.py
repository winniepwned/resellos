"""Mark item as sold command and handler."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from src.domain.entities.item import Item
from src.domain.repositories.item_repository import ItemRepository


class MarkItemSoldCommand:
    def __init__(
        self,
        item_id: UUID,
        user_id: UUID,
        sold_price: Decimal,
        sold_at: datetime | None = None,
    ) -> None:
        self.item_id = item_id
        self.user_id = user_id
        self.sold_price = sold_price
        self.sold_at = sold_at


class MarkItemSoldHandler:
    def __init__(self, item_repo: ItemRepository) -> None:
        self._item_repo = item_repo

    async def handle(self, command: MarkItemSoldCommand) -> Item | None:
        item = await self._item_repo.get_by_id(command.item_id)
        if item is None or item.user_id != command.user_id:
            return None
        item.mark_sold(command.sold_price, command.sold_at)
        return await self._item_repo.save(item)
