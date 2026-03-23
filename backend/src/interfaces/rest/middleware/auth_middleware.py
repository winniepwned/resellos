"""JWT authentication middleware using Supabase."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.infrastructure.supabase.auth import verify_supabase_token

security = HTTPBearer()


async def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Dependency: require valid Supabase JWT."""
    payload = verify_supabase_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )
    return payload
