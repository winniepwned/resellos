"""Update item command and handler."""

from uuid import UUID

from src.domain.entities.item import Item
from src.domain.repositories.item_repository import ItemRepository


class UpdateItemCommand:
    def __init__(self, item_id: UUID, user_id: UUID, **kwargs: object) -> None:
        self.item_id = item_id
        self.user_id = user_id
        self.updates = kwargs


class UpdateItemHandler:
    def __init__(self, item_repo: ItemRepository) -> None:
        self._item_repo = item_repo

    async def handle(self, command: UpdateItemCommand) -> Item | None:
        item = await self._item_repo.get_by_id(command.item_id)
        if item is None or item.user_id != command.user_id:
            return None

        for key, value in command.updates.items():
            if value is not None and hasattr(item, key):
                setattr(item, key, value)

        return await self._item_repo.save(item)
