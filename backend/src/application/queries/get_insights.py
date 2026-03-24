"""Get AI insights query."""

from uuid import UUID

from src.domain.entities.ai_insight import AiInsight
from src.domain.repositories.ai_insight_repository import AiInsightRepository


class GetInsightsQuery:
    def __init__(self, item_id: UUID) -> None:
        self.item_id = item_id


class GetInsightsHandler:
    def __init__(self, insight_repo: AiInsightRepository) -> None:
        self._insight_repo = insight_repo

    async def handle(self, query: GetInsightsQuery) -> AiInsight | None:
        return await self._insight_repo.get_by_item_id(query.item_id)
