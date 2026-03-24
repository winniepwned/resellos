"""Refresh AI insights command and handler."""

from uuid import UUID

from src.domain.repositories.item_repository import ItemRepository
from src.infrastructure.tasks.jobs.item_pipeline import run_item_pipeline


class RefreshInsightsCommand:
    def __init__(self, item_id: UUID, user_id: UUID) -> None:
        self.item_id = item_id
        self.user_id = user_id


class RefreshInsightsHandler:
    def __init__(self, item_repo: ItemRepository) -> None:
        self._item_repo = item_repo

    async def handle(self, command: RefreshInsightsCommand) -> str | None:
        item = await self._item_repo.get_by_id(command.item_id)
        if item is None or item.user_id != command.user_id:
            return None

        item.set_analyzing()
        await self._item_repo.save(item)

        task = run_item_pipeline.delay(
            str(item.id),
            item.brand,
            item.title,
            item.category,
            item.size,
            item.condition,
            item.color,
            float(item.purchase_price_ek),
            item.platform or "vinted",
        )
        return task.id
