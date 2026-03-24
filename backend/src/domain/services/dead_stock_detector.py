"""Dead stock detection domain service."""
from datetime import UTC, datetime, timedelta

from src.domain.entities.item import Item


class DeadStockDetector:
    """Identify items that have been stagnating."""

    def __init__(self, threshold_days: int = 30) -> None:
        self.threshold_days = threshold_days

    def detect(self, items: list[Item]) -> list[Item]:
        cutoff = datetime.now(UTC) - timedelta(days=self.threshold_days)
        dead_stock: list[Item] = []
        for item in items:
            if item.status in ("ready", "listed") and item.deleted_at is None:
                reference_date = item.listed_at or item.created_at
                if reference_date < cutoff:
                    dead_stock.append(item)
        return dead_stock
