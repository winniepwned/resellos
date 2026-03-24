"""List items query and handler."""

from uuid import UUID

from src.domain.entities.item import Item
from src.domain.repositories.item_repository import ItemRepository


class ListItemsQuery:
    def __init__(
        self,
        user_id: UUID,
        status: str | None = None,
        cursor: str | None = None,
        limit: int = 20,
    ) -> None:
        self.user_id = user_id
        self.status = status
        self.cursor = cursor
        self.limit = limit


class ListItemsHandler:
    def __init__(self, item_repo: ItemRepository) -> None:
        self._item_repo = item_repo

    async def handle(self, query: ListItemsQuery) -> tuple[list[Item], str | None]:
        return await self._item_repo.get_by_user_id(
            query.user_id, query.status, query.cursor, query.limit
        )
