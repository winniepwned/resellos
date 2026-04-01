"""Delete item command and handler (soft-delete)."""

from uuid import UUID

from src.domain.repositories.item_repository import ItemRepository


class DeleteItemCommand:
    def __init__(self, item_id: UUID, user_id: UUID) -> None:
        self.item_id = item_id
        self.user_id = user_id


class DeleteItemHandler:
    def __init__(self, item_repo: ItemRepository) -> None:
        self._item_repo = item_repo

    async def handle(self, command: DeleteItemCommand) -> bool:
        item = await self._item_repo.get_by_id(command.item_id)
        if item is None or item.user_id != command.user_id:
            return False
        await self._item_repo.delete(command.item_id)
        return True
