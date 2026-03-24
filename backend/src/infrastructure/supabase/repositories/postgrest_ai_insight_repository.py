"""PostgREST-based AI insight repository."""

from uuid import UUID

from src.domain.entities.ai_insight import AiInsight
from src.domain.repositories.ai_insight_repository import AiInsightRepository
from src.infrastructure.supabase.client import (
    get_http_client,
    parse_datetime,
    parse_decimal,
    postgrest_headers,
    to_json_val,
)


def _to_entity(row: dict) -> AiInsight:
    return AiInsight(
        id=UUID(row["id"]),
        item_id=UUID(row["item_id"]),
        resell_score=row.get("resell_score"),
        suggested_price_low=parse_decimal(row.get("suggested_price_low")),
        suggested_price_optimal=parse_decimal(row.get("suggested_price_optimal")),
        suggested_price_high=parse_decimal(row.get("suggested_price_high")),
        generated_title=row.get("generated_title"),
        generated_description=row.get("generated_description"),
        generated_hashtags=row.get("generated_hashtags"),
        market_reasoning=row.get("market_reasoning"),
        competitor_count=row.get("competitor_count"),
        avg_market_price=parse_decimal(row.get("avg_market_price")),
        demand_level=row.get("demand_level"),
        stagnation_tips=row.get("stagnation_tips"),
        pipeline_version=row.get("pipeline_version"),
        analyzed_at=parse_datetime(row.get("analyzed_at")),
        created_at=parse_datetime(row.get("created_at")) or AiInsight().created_at,
        updated_at=parse_datetime(row.get("updated_at")) or AiInsight().updated_at,
    )


def _to_row(insight: AiInsight) -> dict:
    return {
        "id": to_json_val(insight.id),
        "item_id": to_json_val(insight.item_id),
        "resell_score": insight.resell_score,
        "suggested_price_low": to_json_val(insight.suggested_price_low),
        "suggested_price_optimal": to_json_val(insight.suggested_price_optimal),
        "suggested_price_high": to_json_val(insight.suggested_price_high),
        "generated_title": insight.generated_title,
        "generated_description": insight.generated_description,
        "generated_hashtags": insight.generated_hashtags,
        "market_reasoning": insight.market_reasoning,
        "competitor_count": insight.competitor_count,
        "avg_market_price": to_json_val(insight.avg_market_price),
        "demand_level": insight.demand_level,
        "stagnation_tips": insight.stagnation_tips,
        "pipeline_version": insight.pipeline_version,
        "analyzed_at": to_json_val(insight.analyzed_at),
    }


class PostgRESTAiInsightRepository(AiInsightRepository):
    """AI insight repository using Supabase PostgREST API."""

    def __init__(self, token: str) -> None:
        self._headers = postgrest_headers(token)
        self._client = get_http_client()

    async def get_by_item_id(self, item_id: UUID) -> AiInsight | None:
        response = await self._client.get(
            "/ai_insights",
            params={"item_id": f"eq.{item_id}", "select": "*"},
            headers=self._headers,
        )
        response.raise_for_status()
        rows = response.json()
        return _to_entity(rows[0]) if rows else None

    async def save(self, insight: AiInsight) -> AiInsight:
        existing = await self.get_by_item_id(insight.item_id)

        if existing:
            update_data = _to_row(insight)
            update_data.pop("id", None)
            update_data.pop("item_id", None)
            response = await self._client.patch(
                "/ai_insights",
                params={"item_id": f"eq.{insight.item_id}"},
                json=update_data,
                headers=self._headers,
            )
        else:
            response = await self._client.post(
                "/ai_insights",
                json=_to_row(insight),
                headers=self._headers,
            )
        response.raise_for_status()
        return insight

    async def delete_by_item_id(self, item_id: UUID) -> None:
        response = await self._client.delete(
            "/ai_insights",
            params={"item_id": f"eq.{item_id}"},
            headers=self._headers,
        )
        response.raise_for_status()
