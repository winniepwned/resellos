"""PostgREST-based consent repository."""

from uuid import UUID

from src.domain.entities.consent_record import ConsentRecord
from src.domain.repositories.consent_repository import ConsentRepository
from src.infrastructure.supabase.client import (
    get_http_client,
    parse_datetime,
    postgrest_headers,
    to_json_val,
)


def _to_entity(row: dict) -> ConsentRecord:
    return ConsentRecord(
        id=UUID(row["id"]),
        user_id=UUID(row["user_id"]),
        purpose=row.get("purpose", ""),
        granted=row.get("granted", False),
        granted_at=parse_datetime(row.get("granted_at")),
        revoked_at=parse_datetime(row.get("revoked_at")),
        ip_address=row.get("ip_address"),
        user_agent=row.get("user_agent"),
        created_at=parse_datetime(row.get("created_at")) or ConsentRecord().created_at,
    )


def _to_row(record: ConsentRecord) -> dict:
    return {
        "id": to_json_val(record.id),
        "user_id": to_json_val(record.user_id),
        "purpose": record.purpose,
        "granted": record.granted,
        "granted_at": to_json_val(record.granted_at),
        "revoked_at": to_json_val(record.revoked_at),
        "ip_address": record.ip_address,
        "user_agent": record.user_agent,
    }


class PostgRESTConsentRepository(ConsentRepository):
    """Consent repository using Supabase PostgREST API."""

    def __init__(self, token: str) -> None:
        self._headers = postgrest_headers(token)
        self._client = get_http_client()

    async def get_by_user_id(self, user_id: UUID) -> list[ConsentRecord]:
        response = await self._client.get(
            "/consent_records",
            params={
                "user_id": f"eq.{user_id}",
                "select": "*",
                "order": "created_at.desc",
            },
            headers=self._headers,
        )
        response.raise_for_status()
        return [_to_entity(r) for r in response.json()]

    async def get_by_user_and_purpose(
        self, user_id: UUID, purpose: str
    ) -> ConsentRecord | None:
        response = await self._client.get(
            "/consent_records",
            params={
                "user_id": f"eq.{user_id}",
                "purpose": f"eq.{purpose}",
                "select": "*",
            },
            headers=self._headers,
        )
        response.raise_for_status()
        rows = response.json()
        return _to_entity(rows[0]) if rows else None

    async def save(self, record: ConsentRecord) -> ConsentRecord:
        existing = await self.get_by_user_and_purpose(record.user_id, record.purpose)

        if existing:
            update_data = _to_row(record)
            update_data.pop("id", None)
            update_data.pop("user_id", None)
            update_data.pop("purpose", None)
            response = await self._client.patch(
                "/consent_records",
                params={
                    "user_id": f"eq.{record.user_id}",
                    "purpose": f"eq.{record.purpose}",
                },
                json=update_data,
                headers=self._headers,
            )
        else:
            response = await self._client.post(
                "/consent_records",
                json=_to_row(record),
                headers=self._headers,
            )
        response.raise_for_status()
        return record

    async def delete_by_user_and_purpose(self, user_id: UUID, purpose: str) -> None:
        response = await self._client.delete(
            "/consent_records",
            params={
                "user_id": f"eq.{user_id}",
                "purpose": f"eq.{purpose}",
            },
            headers=self._headers,
        )
        response.raise_for_status()
