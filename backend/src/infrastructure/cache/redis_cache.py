"""Redis cache for pipeline status tracking."""

import json

import redis.asyncio as redis

from src.config import settings


class RedisCache:
    """Async Redis cache for pipeline status and rate limiting."""

    def __init__(self) -> None:
        self._redis: redis.Redis | None = None

    async def _get_client(self) -> redis.Redis:
        if self._redis is None:
            self._redis = redis.from_url(settings.redis_url, decode_responses=True)
        return self._redis

    async def set_pipeline_status(
        self, task_id: str, status: dict, ttl: int = 3600
    ) -> None:
        client = await self._get_client()
        await client.setex(f"pipeline:{task_id}", ttl, json.dumps(status))

    async def get_pipeline_status(self, task_id: str) -> dict | None:
        client = await self._get_client()
        data = await client.get(f"pipeline:{task_id}")
        if data:
            return json.loads(data)
        return None

    async def check_rate_limit(
        self, user_id: str, limit: int, window_seconds: int = 60
    ) -> bool:
        """Token bucket rate limiting. Returns True if allowed."""
        client = await self._get_client()
        key = f"ratelimit:{user_id}"
        current = await client.incr(key)
        if current == 1:
            await client.expire(key, window_seconds)
        return current <= limit

    async def close(self) -> None:
        if self._redis:
            await self._redis.aclose()
