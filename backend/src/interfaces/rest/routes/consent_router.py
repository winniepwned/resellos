"""Consent management routes (GDPR Art. 7)."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request

from src.application.commands.grant_consent import GrantConsentCommand, GrantConsentHandler
from src.application.commands.revoke_consent import RevokeConsentCommand, RevokeConsentHandler
from src.application.queries.get_user_consents import GetUserConsentsHandler, GetUserConsentsQuery
from src.infrastructure.supabase.repositories.postgrest_consent_repository import (
    PostgRESTConsentRepository,
)
from src.interfaces.rest.dependencies.auth import get_token, get_user_id
from src.interfaces.rest.schemas.consent_schemas import ConsentGrantSchema

router = APIRouter()


@router.post("")
async def grant_consent(
    body: ConsentGrantSchema,
    request: Request,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Grant consent for a specific purpose (GDPR Art. 7)."""
    handler = GrantConsentHandler(PostgRESTConsentRepository(token))
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    command = GrantConsentCommand(
        user_id=user_id,
        purpose=body.purpose,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    record = await handler.handle(command)
    return {
        "id": record.id,
        "purpose": record.purpose,
        "granted": record.granted,
        "granted_at": record.granted_at,
        "created_at": record.created_at,
    }


@router.get("")
async def get_consents(
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Get all consent records for current user."""
    handler = GetUserConsentsHandler(PostgRESTConsentRepository(token))
    records = await handler.handle(GetUserConsentsQuery(user_id=user_id))
    return {
        "consents": [
            {
                "id": r.id,
                "purpose": r.purpose,
                "granted": r.granted,
                "granted_at": r.granted_at,
                "revoked_at": r.revoked_at,
                "created_at": r.created_at,
            }
            for r in records
        ]
    }


@router.delete("/{purpose}")
async def revoke_consent(
    purpose: str,
    user_id: UUID = Depends(get_user_id),
    token: str = Depends(get_token),
) -> dict:
    """Revoke consent for a specific purpose."""
    handler = RevokeConsentHandler(PostgRESTConsentRepository(token))
    revoked = await handler.handle(RevokeConsentCommand(user_id=user_id, purpose=purpose))
    if not revoked:
        raise HTTPException(status_code=404, detail="Consent record not found.")
    return {"message": f"Consent for '{purpose}' revoked."}
