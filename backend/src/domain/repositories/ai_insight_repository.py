"""Abstract AI insight repository."""
from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.ai_insight import AiInsight


class AiInsightRepository(ABC):
    @abstractmethod
    async def get_by_item_id(self, item_id: UUID) -> AiInsight | None: ...

    @abstractmethod
    async def save(self, insight: AiInsight) -> AiInsight: ...

    @abstractmethod
    async def delete_by_item_id(self, item_id: UUID) -> None: ...
