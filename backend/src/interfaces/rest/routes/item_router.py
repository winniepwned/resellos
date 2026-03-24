"""Item routes — CRUD + mark-sold/mark-listed."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.application.commands.create_item import CreateItemCommand, CreateItemHandler
from src.application.commands.delete_item import DeleteItemCommand, DeleteItemHandler
from src.application.commands.mark_item_listed import MarkItemListedCommand, MarkItemListedHandler
from src.application.commands.mark_item_sold import MarkItemSoldCommand, MarkItemSoldHandler
from src.application.commands.refresh_insights import RefreshInsightsCommand, RefreshInsightsHandler
from src.application.commands.update_item import UpdateItemCommand, UpdateItemHandler
from src.application.queries.get_insights import GetInsightsHandler, GetInsightsQuery
from src.application.queries.get_item import GetItemHandler, GetItemQuery
from src.application.queries.list_items import ListItemsHandler, ListItemsQuery
from src.infrastructure.supabase.repositories.postgrest_ai_insight_repository import (
    PostgRESTAiInsightRepository,
)
from src.infrastructure.supabase.repositories.postgrest_item_repository import (
    PostgRESTItemRepository,
)
from src.interfaces.rest.dependencies.auth import get_token, get_user_id
from src.interfaces.rest.dependencies.pagination import PaginationParams
from src.interfaces.rest.schemas.item_schemas import (
    ItemCreateSchema,
    ItemListResponseSchema,
    ItemResponseSchema,
    ItemUpdateSchema,
    MarkListedSchema,
    MarkSoldSchema,
)

router = APIRouter()


def _to_float(val: object) -> float | None:
    return float(val) if val is not None else None


def _to_response(item: object) -> dict:
    return {
        "id": item.id,  # type: ignore[attr-defined]
        "user_id": item.user_id,  # type: ignore[attr-defined]
        "title": item.title,  # type: ignore[attr-defined]
        "brand": item.brand,  # type: ignore[attr-defined]
        "category": item.category,  # type: ignore[attr-defined]
        "size": item.size,  # type: ignore[attr-defined]
        "condition": item.condition,  # type: ignore[attr-defined]
        "color": item.color,  # type: ignore[attr-defined]
        "purchase_price_ek": _to_float(item.purchase_price_ek),  # type: ignore[attr-defined]
        "target_price": _to_float(item.target_price),  # type: ignore[attr-defined]
        "sold_price": _to_float(item.sold_price),  # type: ignore[attr-defined]
        "status": item.status,  # type: ignore[attr-defined]
        "platform": item.platform,  # type: ignore[attr-defined]
        "notes": item.notes,  # type: ignore[attr-defined]
        "images": item.images,  # type: ignore[attr-defined]
        "listed_at": item.listed_at,  # type: ignore[attr-defined]
        "sold_at": item.sold_at,  # type: ignore[attr-defined]
        "created_at": item.created_at,  # type: ignore[attr-defined]
        "updated_at": item.updated_at,  # type: ignore[attr-defined]
    }


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ItemResponseSchema)
async def create_item(
    body: ItemCreateSchema,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Create a new item (starts Item Creation Pipeline)."""
    handler = CreateItemHandler(PostgRESTItemRepository(token))
    command = CreateItemCommand(
        user_id=user_id,
        title=body.title,
        brand=body.brand,
        purchase_price_ek=body.purchase_price_ek,
        condition=body.condition,
        category=body.category,
        size=body.size,
        color=body.color,
        platform=body.platform,
        notes=body.notes,
        images=body.images,
    )
    item = await handler.handle(command)
    return _to_response(item)


@router.get("", response_model=ItemListResponseSchema)
async def list_items(
    pagination: PaginationParams = Depends(),
    item_status: str | None = Query(None, alias="status"),
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """List items with cursor-based pagination and optional status filter."""
    handler = ListItemsHandler(PostgRESTItemRepository(token))
    query = ListItemsQuery(
        user_id=user_id,
        status=item_status,
        cursor=pagination.cursor,
        limit=pagination.limit,
    )
    items, next_cursor = await handler.handle(query)
    return {
        "items": [_to_response(i) for i in items],
        "next_cursor": next_cursor,
    }


@router.get("/{item_id}", response_model=ItemResponseSchema)
async def get_item(
    item_id: UUID,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Get item detail."""
    handler = GetItemHandler(PostgRESTItemRepository(token))
    item = await handler.handle(GetItemQuery(item_id=item_id, user_id=user_id))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found.")
    return _to_response(item)


@router.patch("/{item_id}", response_model=ItemResponseSchema)
async def update_item(
    item_id: UUID,
    body: ItemUpdateSchema,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Update an item."""
    handler = UpdateItemHandler(PostgRESTItemRepository(token))
    command = UpdateItemCommand(
        item_id=item_id,
        user_id=user_id,
        **body.model_dump(exclude_none=True),
    )
    item = await handler.handle(command)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found.")
    return _to_response(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: UUID,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> None:
    """Soft-delete an item."""
    handler = DeleteItemHandler(PostgRESTItemRepository(token))
    deleted = await handler.handle(DeleteItemCommand(item_id=item_id, user_id=user_id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found.")


@router.post("/{item_id}/mark-sold", response_model=ItemResponseSchema)
async def mark_item_sold(
    item_id: UUID,
    body: MarkSoldSchema,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Mark item as sold."""
    handler = MarkItemSoldHandler(PostgRESTItemRepository(token))
    command = MarkItemSoldCommand(
        item_id=item_id, user_id=user_id, sold_price=body.sold_price, sold_at=body.sold_at
    )
    item = await handler.handle(command)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found.")
    return _to_response(item)


@router.post("/{item_id}/mark-listed", response_model=ItemResponseSchema)
async def mark_item_listed(
    item_id: UUID,
    body: MarkListedSchema,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Mark item as listed on a platform."""
    handler = MarkItemListedHandler(PostgRESTItemRepository(token))
    command = MarkItemListedCommand(
        item_id=item_id, user_id=user_id, platform=body.platform, listed_at=body.listed_at
    )
    item = await handler.handle(command)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found.")
    return _to_response(item)


@router.get("/{item_id}/insights")
async def get_insights(
    item_id: UUID,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Get AI insights for an item."""
    # Verify ownership
    item_handler = GetItemHandler(PostgRESTItemRepository(token))
    item = await item_handler.handle(GetItemQuery(item_id=item_id, user_id=user_id))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found.")

    handler = GetInsightsHandler(PostgRESTAiInsightRepository(token))
    insight = await handler.handle(GetInsightsQuery(item_id=item_id))
    if insight is None:
        return {"detail": "No insights available yet."}
    return {
        "id": insight.id,
        "item_id": insight.item_id,
        "resell_score": insight.resell_score,
        "suggested_price_low": _to_float(insight.suggested_price_low),
        "suggested_price_optimal": _to_float(insight.suggested_price_optimal),
        "suggested_price_high": _to_float(insight.suggested_price_high),
        "generated_title": insight.generated_title,
        "generated_description": insight.generated_description,
        "generated_hashtags": insight.generated_hashtags,
        "market_reasoning": insight.market_reasoning,
        "competitor_count": insight.competitor_count,
        "avg_market_price": _to_float(insight.avg_market_price),
        "demand_level": insight.demand_level,
        "analyzed_at": insight.analyzed_at,
    }


@router.post("/{item_id}/insights/refresh")
async def refresh_insights(
    item_id: UUID,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Trigger AI insights refresh for an item."""
    handler = RefreshInsightsHandler(PostgRESTItemRepository(token))
    task_id = await handler.handle(RefreshInsightsCommand(item_id=item_id, user_id=user_id))
    if task_id is None:
        raise HTTPException(status_code=404, detail="Item not found.")
    return {"task_id": task_id, "status": "analyzing"}


@router.get("/{item_id}/pipeline/status")
async def get_pipeline_status(
    item_id: UUID,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Get item pipeline status."""
    item_handler = GetItemHandler(PostgRESTItemRepository(token))
    item = await item_handler.handle(GetItemQuery(item_id=item_id, user_id=user_id))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found.")
    return {"item_id": str(item_id), "status": item.status}
