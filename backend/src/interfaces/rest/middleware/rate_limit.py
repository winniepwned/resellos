"""Rate limiting middleware — Token-Bucket via Redis (ISO-826-RATELIMIT)."""

import hashlib

from fastapi import HTTPException, Request, status

from src.infrastructure.cache.redis_cache import RedisCache

_cache = RedisCache()


async def check_rate_limit(request: Request) -> None:
    """Check rate limit for the current user. Call as a dependency."""
    auth_header = request.headers.get("authorization", "")
    if not auth_header:
        return

    key = hashlib.sha256(auth_header.encode()).hexdigest()[:16]
    allowed = await _cache.check_rate_limit(key, limit=30, window_seconds=60)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later.",
        )
