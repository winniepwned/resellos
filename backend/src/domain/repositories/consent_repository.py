"""Abstract consent repository."""
from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.consent_record import ConsentRecord


class ConsentRepository(ABC):
    @abstractmethod
    async def get_by_user_id(self, user_id: UUID) -> list[ConsentRecord]: ...

    @abstractmethod
    async def get_by_user_and_purpose(
        self, user_id: UUID, purpose: str,
    ) -> ConsentRecord | None: ...

    @abstractmethod
    async def save(self, record: ConsentRecord) -> ConsentRecord: ...

    @abstractmethod
    async def delete_by_user_and_purpose(self, user_id: UUID, purpose: str) -> None: ...
