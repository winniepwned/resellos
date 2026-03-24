"""Mark item as listed command and handler."""

from datetime import datetime
from uuid import UUID

from src.domain.entities.item import Item
from src.domain.repositories.item_repository import ItemRepository


class MarkItemListedCommand:
    def __init__(
        self,
        item_id: UUID,
        user_id: UUID,
        platform: str,
        listed_at: datetime | None = None,
    ) -> None:
        self.item_id = item_id
        self.user_id = user_id
        self.platform = platform
        self.listed_at = listed_at


class MarkItemListedHandler:
    def __init__(self, item_repo: ItemRepository) -> None:
        self._item_repo = item_repo

    async def handle(self, command: MarkItemListedCommand) -> Item | None:
        item = await self._item_repo.get_by_id(command.item_id)
        if item is None or item.user_id != command.user_id:
            return None
        item.mark_listed(command.platform, command.listed_at)
        return await self._item_repo.save(item)
