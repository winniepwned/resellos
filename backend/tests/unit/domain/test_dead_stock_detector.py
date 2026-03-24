"""Tests for DeadStockDetector domain service."""
from datetime import UTC, datetime, timedelta
from src.domain.entities.item import Item
from src.domain.services.dead_stock_detector import DeadStockDetector


def test_detects_stagnating_items():
    old_date = datetime.now(UTC) - timedelta(days=45)
    items = [
        Item(status="ready", created_at=old_date),
        Item(status="listed", listed_at=old_date, created_at=old_date),
        Item(status="draft", created_at=old_date),  # Not ready/listed
        Item(status="sold", created_at=old_date),    # Sold, not dead
    ]
    detector = DeadStockDetector(threshold_days=30)
    dead = detector.detect(items)
    assert len(dead) == 2


def test_no_dead_stock_recent_items():
    recent = datetime.now(UTC) - timedelta(days=5)
    items = [Item(status="ready", created_at=recent)]
    detector = DeadStockDetector(threshold_days=30)
    dead = detector.detect(items)
    assert len(dead) == 0


def test_custom_threshold():
    old_date = datetime.now(UTC) - timedelta(days=10)
    items = [Item(status="listed", listed_at=old_date, created_at=old_date)]
    detector = DeadStockDetector(threshold_days=7)
    dead = detector.detect(items)
    assert len(dead) == 1


def test_deleted_items_excluded():
    old_date = datetime.now(UTC) - timedelta(days=45)
    items = [Item(status="ready", created_at=old_date, deleted_at=datetime.now(UTC))]
    detector = DeadStockDetector(threshold_days=30)
    dead = detector.detect(items)
    assert len(dead) == 0
