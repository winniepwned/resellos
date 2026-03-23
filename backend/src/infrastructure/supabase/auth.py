"""Supabase JWT authentication utilities."""

from jose import JWTError, jwt

from src.config import settings


def verify_supabase_token(token: str) -> dict | None:
    """Verify a Supabase JWT token and return claims."""
    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except JWTError:
        return None
