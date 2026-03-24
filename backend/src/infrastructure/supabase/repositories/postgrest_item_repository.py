"""PostgREST-based item repository using Supabase REST API."""

from decimal import Decimal
from uuid import UUID

from src.domain.entities.item import Item
from src.domain.repositories.item_repository import ItemRepository
from src.infrastructure.supabase.client import (
    get_http_client,
    parse_datetime,
    parse_decimal,
    postgrest_headers,
    to_json_val,
)


def _to_entity(row: dict) -> Item:
    return Item(
        id=UUID(row["id"]),
        user_id=UUID(row["user_id"]),
        title=row["title"],
        brand=row["brand"],
        category=row.get("category"),
        size=row.get("size"),
        condition=row.get("condition", "good"),
        color=row.get("color"),
        purchase_price_ek=parse_decimal(row.get("purchase_price_ek")) or Decimal("0"),
        target_price=parse_decimal(row.get("target_price")),
        sold_price=parse_decimal(row.get("sold_price")),
        status=row.get("status", "draft"),
        platform=row.get("platform"),
        notes=row.get("notes"),
        images=row.get("images") or [],
        listed_at=parse_datetime(row.get("listed_at")),
        sold_at=parse_datetime(row.get("sold_at")),
        created_at=parse_datetime(row.get("created_at")) or Item().created_at,
        updated_at=parse_datetime(row.get("updated_at")) or Item().updated_at,
        deleted_at=parse_datetime(row.get("deleted_at")),
    )


def _to_row(item: Item) -> dict:
    return {
        "id": to_json_val(item.id),
        "user_id": to_json_val(item.user_id),
        "title": item.title,
        "brand": item.brand,
        "category": item.category,
        "size": item.size,
        "condition": item.condition,
        "color": item.color,
        "purchase_price_ek": to_json_val(item.purchase_price_ek),
        "target_price": to_json_val(item.target_price),
        "sold_price": to_json_val(item.sold_price),
        "status": item.status,
        "platform": item.platform,
        "notes": item.notes,
        "images": item.images,
        "listed_at": to_json_val(item.listed_at),
        "sold_at": to_json_val(item.sold_at),
        "deleted_at": to_json_val(item.deleted_at),
    }


class PostgRESTItemRepository(ItemRepository):
    """Item repository using Supabase PostgREST API."""

    def __init__(self, token: str) -> None:
        self._token = token
        self._headers = postgrest_headers(token)
        self._client = get_http_client()

    async def get_by_id(self, item_id: UUID) -> Item | None:
        response = await self._client.get(
            "/items",
            params={
                "id": f"eq.{item_id}",
                "deleted_at": "is.null",
                "select": "*",
            },
            headers=self._headers,
        )
        response.raise_for_status()
        rows = response.json()
        return _to_entity(rows[0]) if rows else None

    async def get_by_user_id(
        self,
        user_id: UUID,
        status: str | None = None,
        cursor: str | None = None,
        limit: int = 20,
    ) -> tuple[list[Item], str | None]:
        params: dict[str, str] = {
            "user_id": f"eq.{user_id}",
            "deleted_at": "is.null",
            "select": "*",
            "order": "created_at.desc",
            "limit": str(limit + 1),
        }
        if status:
            params["status"] = f"eq.{status}"
        if cursor:
            params["id"] = f"lt.{cursor}"

        response = await self._client.get("/items", params=params, headers=self._headers)
        response.raise_for_status()
        rows = response.json()

        next_cursor = None
        if len(rows) > limit:
            next_cursor = rows[limit - 1]["id"]
            rows = rows[:limit]

        return [_to_entity(r) for r in rows], next_cursor

    async def save(self, item: Item) -> Item:
        # Try update first (PATCH with filter)
        existing = await self.get_by_id(item.id)

        if existing:
            update_data = _to_row(item)
            update_data.pop("id", None)
            update_data.pop("user_id", None)
            response = await self._client.patch(
                "/items",
                params={"id": f"eq.{item.id}"},
                json=update_data,
                headers=self._headers,
            )
        else:
            response = await self._client.post(
                "/items",
                json=_to_row(item),
                headers=self._headers,
            )
        response.raise_for_status()
        return item

    async def delete(self, item_id: UUID) -> None:
        response = await self._client.delete(
            "/items",
            params={"id": f"eq.{item_id}"},
            headers=self._headers,
        )
        response.raise_for_status()
