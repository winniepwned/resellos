"""Get sourcing pipeline status query."""

from src.domain.entities.sourcing_result import SourcingResult
from src.domain.repositories.sourcing_result_repository import SourcingResultRepository


class GetSourcingStatusQuery:
    def __init__(self, task_id: str) -> None:
        self.task_id = task_id


class GetSourcingStatusHandler:
    def __init__(self, sourcing_repo: SourcingResultRepository) -> None:
        self._sourcing_repo = sourcing_repo

    async def handle(self, query: GetSourcingStatusQuery) -> SourcingResult | None:
        return await self._sourcing_repo.get_by_task_id(query.task_id)
