"""Abstract sourcing result repository."""
from abc import ABC, abstractmethod
from datetime import datetime
from uuid import UUID

from src.domain.entities.sourcing_result import SourcingResult


class SourcingResultRepository(ABC):
    @abstractmethod
    async def get_by_task_id(self, task_id: str) -> SourcingResult | None: ...

    @abstractmethod
    async def get_by_user_id(self, user_id: UUID) -> list[SourcingResult]: ...

    @abstractmethod
    async def save(self, result: SourcingResult) -> SourcingResult: ...

    @abstractmethod
    async def delete_older_than(self, before: datetime) -> int: ...
