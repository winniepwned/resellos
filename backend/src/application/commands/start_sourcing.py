"""Start sourcing pipeline command and handler."""

from uuid import UUID

from src.domain.entities.sourcing_result import SourcingResult
from src.domain.repositories.sourcing_result_repository import SourcingResultRepository
from src.infrastructure.tasks.jobs.sourcing_pipeline import run_sourcing_pipeline


class StartSourcingCommand:
    def __init__(self, user_id: UUID, keyword: str, image_url: str | None = None) -> None:
        self.user_id = user_id
        self.keyword = keyword
        self.image_url = image_url


class StartSourcingHandler:
    def __init__(self, sourcing_repo: SourcingResultRepository) -> None:
        self._sourcing_repo = sourcing_repo

    async def handle(self, command: StartSourcingCommand) -> SourcingResult:
        task = run_sourcing_pipeline.delay(
            str(command.user_id), command.keyword, command.image_url
        )
        result = SourcingResult(
            user_id=command.user_id,
            task_id=task.id,
            status="pending",
            input_keyword=command.keyword,
            input_image_url=command.image_url,
        )
        return await self._sourcing_repo.save(result)
