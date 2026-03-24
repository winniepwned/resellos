"""PostgREST-based sourcing result repository."""

from datetime import datetime
from uuid import UUID

from src.domain.entities.sourcing_result import SourcingResult
from src.domain.repositories.sourcing_result_repository import SourcingResultRepository
from src.infrastructure.supabase.client import (
    get_http_client,
    parse_datetime,
    parse_decimal,
    postgrest_headers,
    to_json_val,
)


def _to_entity(row: dict) -> SourcingResult:
    return SourcingResult(
        id=UUID(row["id"]),
        user_id=UUID(row["user_id"]),
        task_id=row.get("task_id", ""),
        status=row.get("status", "pending"),
        input_keyword=row.get("input_keyword"),
        input_image_url=row.get("input_image_url"),
        detected_brand=row.get("detected_brand"),
        detected_category=row.get("detected_category"),
        resell_score=row.get("resell_score"),
        estimated_profit_low=parse_decimal(row.get("estimated_profit_low")),
        estimated_profit_high=parse_decimal(row.get("estimated_profit_high")),
        market_reasoning=row.get("market_reasoning"),
        recommendation=row.get("recommendation"),
        pipeline_steps=row.get("pipeline_steps"),
        created_at=parse_datetime(row.get("created_at")) or SourcingResult().created_at,
        completed_at=parse_datetime(row.get("completed_at")),
    )


class PostgRESTSourcingResultRepository(SourcingResultRepository):
    """Sourcing result repository using Supabase PostgREST API."""

    def __init__(self, token: str) -> None:
        self._headers = postgrest_headers(token)
        self._client = get_http_client()

    async def get_by_task_id(self, task_id: str) -> SourcingResult | None:
        response = await self._client.get(
            "/sourcing_results",
            params={"task_id": f"eq.{task_id}", "select": "*"},
            headers=self._headers,
        )
        response.raise_for_status()
        rows = response.json()
        return _to_entity(rows[0]) if rows else None

    async def get_by_user_id(self, user_id: UUID) -> list[SourcingResult]:
        response = await self._client.get(
            "/sourcing_results",
            params={
                "user_id": f"eq.{user_id}",
                "select": "*",
                "order": "created_at.desc",
            },
            headers=self._headers,
        )
        response.raise_for_status()
        return [_to_entity(r) for r in response.json()]

    async def save(self, result_entity: SourcingResult) -> SourcingResult:
        existing = await self.get_by_task_id(result_entity.task_id)

        if existing:
            update_data = {
                "status": result_entity.status,
                "detected_brand": result_entity.detected_brand,
                "detected_category": result_entity.detected_category,
                "resell_score": result_entity.resell_score,
                "estimated_profit_low": to_json_val(result_entity.estimated_profit_low),
                "estimated_profit_high": to_json_val(result_entity.estimated_profit_high),
                "market_reasoning": result_entity.market_reasoning,
                "recommendation": result_entity.recommendation,
                "pipeline_steps": result_entity.pipeline_steps,
                "completed_at": to_json_val(result_entity.completed_at),
            }
            response = await self._client.patch(
                "/sourcing_results",
                params={"task_id": f"eq.{result_entity.task_id}"},
                json=update_data,
                headers=self._headers,
            )
        else:
            data = {
                "id": to_json_val(result_entity.id),
                "user_id": to_json_val(result_entity.user_id),
                "task_id": result_entity.task_id,
                "status": result_entity.status,
                "input_keyword": result_entity.input_keyword,
                "input_image_url": result_entity.input_image_url,
            }
            response = await self._client.post(
                "/sourcing_results",
                json=data,
                headers=self._headers,
            )
        response.raise_for_status()
        return result_entity

    async def delete_older_than(self, before: datetime) -> int:
        response = await self._client.delete(
            "/sourcing_results",
            params={"created_at": f"lt.{before.isoformat()}"},
            headers={**self._headers, "Prefer": "return=representation"},
        )
        response.raise_for_status()
        return len(response.json())
