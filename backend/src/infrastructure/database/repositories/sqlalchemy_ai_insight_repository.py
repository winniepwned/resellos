"""SQLAlchemy AI insight repository implementation."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.ai_insight import AiInsight
from src.domain.repositories.ai_insight_repository import AiInsightRepository
from src.infrastructure.database.models.ai_insight_model import AiInsightModel


class SqlAlchemyAiInsightRepository(AiInsightRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: AiInsightModel) -> AiInsight:
        return AiInsight(
            id=model.id,
            item_id=model.item_id,
            resell_score=model.resell_score,
            suggested_price_low=model.suggested_price_low,
            suggested_price_optimal=model.suggested_price_optimal,
            suggested_price_high=model.suggested_price_high,
            generated_title=model.generated_title,
            generated_description=model.generated_description,
            generated_hashtags=model.generated_hashtags,
            market_reasoning=model.market_reasoning,
            competitor_count=model.competitor_count,
            avg_market_price=model.avg_market_price,
            demand_level=model.demand_level,
            stagnation_tips=model.stagnation_tips,
            pipeline_version=model.pipeline_version,
            analyzed_at=model.analyzed_at,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    async def get_by_item_id(self, item_id: UUID) -> AiInsight | None:
        stmt = select(AiInsightModel).where(AiInsightModel.item_id == item_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def save(self, insight: AiInsight) -> AiInsight:
        stmt = select(AiInsightModel).where(AiInsightModel.item_id == insight.item_id)
        result = await self._session.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            existing.resell_score = insight.resell_score
            existing.suggested_price_low = insight.suggested_price_low
            existing.suggested_price_optimal = insight.suggested_price_optimal
            existing.suggested_price_high = insight.suggested_price_high
            existing.generated_title = insight.generated_title
            existing.generated_description = insight.generated_description
            existing.generated_hashtags = insight.generated_hashtags
            existing.market_reasoning = insight.market_reasoning
            existing.competitor_count = insight.competitor_count
            existing.avg_market_price = insight.avg_market_price
            existing.demand_level = insight.demand_level
            existing.stagnation_tips = insight.stagnation_tips
            existing.pipeline_version = insight.pipeline_version
            existing.analyzed_at = insight.analyzed_at
        else:
            model = AiInsightModel(
                id=insight.id,
                item_id=insight.item_id,
                resell_score=insight.resell_score,
                suggested_price_low=insight.suggested_price_low,
                suggested_price_optimal=insight.suggested_price_optimal,
                suggested_price_high=insight.suggested_price_high,
                generated_title=insight.generated_title,
                generated_description=insight.generated_description,
                generated_hashtags=insight.generated_hashtags,
                market_reasoning=insight.market_reasoning,
                competitor_count=insight.competitor_count,
                avg_market_price=insight.avg_market_price,
                demand_level=insight.demand_level,
                stagnation_tips=insight.stagnation_tips,
                pipeline_version=insight.pipeline_version,
                analyzed_at=insight.analyzed_at,
            )
            self._session.add(model)

        await self._session.commit()
        return insight

    async def delete_by_item_id(self, item_id: UUID) -> None:
        stmt = select(AiInsightModel).where(AiInsightModel.item_id == item_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.commit()
