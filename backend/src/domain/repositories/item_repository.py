"""Abstract item repository."""
from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.item import Item


class ItemRepository(ABC):
    @abstractmethod
    async def get_by_id(self, item_id: UUID) -> Item | None: ...

    @abstractmethod
    async def get_by_user_id(
        self,
        user_id: UUID,
        status: str | None = None,
        cursor: str | None = None,
        limit: int = 20,
    ) -> tuple[list[Item], str | None]: ...

    @abstractmethod
    async def save(self, item: Item) -> Item: ...

    @abstractmethod
    async def delete(self, item_id: UUID) -> None: ...
