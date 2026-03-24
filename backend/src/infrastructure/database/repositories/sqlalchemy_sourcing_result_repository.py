"""SQLAlchemy sourcing result repository implementation."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.sourcing_result import SourcingResult
from src.domain.repositories.sourcing_result_repository import SourcingResultRepository
from src.infrastructure.database.models.sourcing_result_model import SourcingResultModel


class SqlAlchemySourcingResultRepository(SourcingResultRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: SourcingResultModel) -> SourcingResult:
        return SourcingResult(
            id=model.id,
            user_id=model.user_id,
            task_id=model.task_id,
            status=model.status,
            input_keyword=model.input_keyword,
            input_image_url=model.input_image_url,
            detected_brand=model.detected_brand,
            detected_category=model.detected_category,
            resell_score=model.resell_score,
            estimated_profit_low=model.estimated_profit_low,
            estimated_profit_high=model.estimated_profit_high,
            market_reasoning=model.market_reasoning,
            recommendation=model.recommendation,
            pipeline_steps=model.pipeline_steps,
            created_at=model.created_at,
            completed_at=model.completed_at,
        )

    async def get_by_task_id(self, task_id: str) -> SourcingResult | None:
        stmt = select(SourcingResultModel).where(SourcingResultModel.task_id == task_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_by_user_id(self, user_id: UUID) -> list[SourcingResult]:
        stmt = (
            select(SourcingResultModel)
            .where(SourcingResultModel.user_id == user_id)
            .order_by(SourcingResultModel.created_at.desc())
        )
        result = await self._session.execute(stmt)
        return [self._to_entity(m) for m in result.scalars().all()]

    async def save(self, result_entity: SourcingResult) -> SourcingResult:
        stmt = select(SourcingResultModel).where(
            SourcingResultModel.task_id == result_entity.task_id
        )
        result = await self._session.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            existing.status = result_entity.status
            existing.detected_brand = result_entity.detected_brand
            existing.detected_category = result_entity.detected_category
            existing.resell_score = result_entity.resell_score
            existing.estimated_profit_low = result_entity.estimated_profit_low
            existing.estimated_profit_high = result_entity.estimated_profit_high
            existing.market_reasoning = result_entity.market_reasoning
            existing.recommendation = result_entity.recommendation
            existing.pipeline_steps = result_entity.pipeline_steps
            existing.completed_at = result_entity.completed_at
        else:
            model = SourcingResultModel(
                id=result_entity.id,
                user_id=result_entity.user_id,
                task_id=result_entity.task_id,
                status=result_entity.status,
                input_keyword=result_entity.input_keyword,
                input_image_url=result_entity.input_image_url,
            )
            self._session.add(model)

        await self._session.commit()
        return result_entity

    async def delete_older_than(self, before: datetime) -> int:
        stmt = delete(SourcingResultModel).where(SourcingResultModel.created_at < before)
        result = await self._session.execute(stmt)
        await self._session.commit()
        return result.rowcount
