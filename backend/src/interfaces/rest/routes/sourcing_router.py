"""Sourcing pipeline routes."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from src.application.commands.start_sourcing import StartSourcingCommand, StartSourcingHandler
from src.application.queries.get_sourcing_status import (
    GetSourcingStatusHandler,
    GetSourcingStatusQuery,
)
from src.infrastructure.supabase.repositories.postgrest_sourcing_result_repository import (
    PostgRESTSourcingResultRepository,
)
from src.interfaces.rest.dependencies.auth import get_token, get_user_id
from src.interfaces.rest.schemas.sourcing_schemas import SourcingStartSchema

router = APIRouter()


@router.post("/analyze")
async def start_sourcing(
    body: SourcingStartSchema,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Start sourcing pipeline (keyword + optional image)."""
    handler = StartSourcingHandler(PostgRESTSourcingResultRepository(token))
    command = StartSourcingCommand(
        user_id=user_id, keyword=body.keyword, image_url=body.image_url
    )
    result = await handler.handle(command)
    return {"task_id": result.task_id, "status": result.status}


@router.get("/{task_id}/status")
async def get_sourcing_status(
    task_id: str,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Get sourcing pipeline status."""
    handler = GetSourcingStatusHandler(PostgRESTSourcingResultRepository(token))
    result = await handler.handle(GetSourcingStatusQuery(task_id=task_id))
    if result is None or result.user_id != user_id:
        raise HTTPException(status_code=404, detail="Sourcing task not found.")
    return {
        "task_id": result.task_id,
        "status": result.status,
        "pipeline_steps": result.pipeline_steps,
    }


@router.get("/{task_id}/result")
async def get_sourcing_result(
    task_id: str,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Get completed sourcing result."""
    handler = GetSourcingStatusHandler(PostgRESTSourcingResultRepository(token))
    result = await handler.handle(GetSourcingStatusQuery(task_id=task_id))
    if result is None or result.user_id != user_id:
        raise HTTPException(status_code=404, detail="Sourcing task not found.")
    return {
        "id": result.id,
        "task_id": result.task_id,
        "status": result.status,
        "input_keyword": result.input_keyword,
        "detected_brand": result.detected_brand,
        "detected_category": result.detected_category,
        "resell_score": result.resell_score,
        "estimated_profit_low": float(result.estimated_profit_low) if result.estimated_profit_low else None,
        "estimated_profit_high": float(result.estimated_profit_high) if result.estimated_profit_high else None,
        "market_reasoning": result.market_reasoning,
        "recommendation": result.recommendation,
        "pipeline_steps": result.pipeline_steps,
        "created_at": result.created_at,
        "completed_at": result.completed_at,
    }
