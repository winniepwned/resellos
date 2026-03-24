"""Authentication dependency."""

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.infrastructure.supabase.auth import verify_supabase_token

security = HTTPBearer()


async def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Dependency: require valid Supabase JWT."""
    payload = await verify_supabase_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )
    return payload


def get_user_id(payload: dict = Depends(require_auth)) -> UUID:
    """Extract user_id from JWT payload."""
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing subject.",
        )
    return UUID(sub)


def get_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """Extract raw bearer token for PostgREST forwarding."""
    return credentials.credentials
