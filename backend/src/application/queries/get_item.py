"""Get item query and handler."""

from uuid import UUID

from src.domain.entities.item import Item
from src.domain.repositories.item_repository import ItemRepository


class GetItemQuery:
    def __init__(self, item_id: UUID, user_id: UUID) -> None:
        self.item_id = item_id
        self.user_id = user_id


class GetItemHandler:
    def __init__(self, item_repo: ItemRepository) -> None:
        self._item_repo = item_repo

    async def handle(self, query: GetItemQuery) -> Item | None:
        item = await self._item_repo.get_by_id(query.item_id)
        if item is None or item.user_id != query.user_id:
            return None
        return item
