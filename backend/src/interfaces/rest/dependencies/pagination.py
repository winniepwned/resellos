"""Cursor-based pagination dependency."""

from fastapi import Query


class PaginationParams:
    """Cursor-based pagination parameters."""

    def __init__(
        self,
        cursor: str | None = Query(None, description="Cursor for next page"),
        limit: int = Query(20, ge=1, le=100, description="Items per page"),
    ) -> None:
        self.cursor = cursor
        self.limit = limit
