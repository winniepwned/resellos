"""Tests for Item entity."""
from decimal import Decimal
from datetime import datetime
from src.domain.entities.item import Item


def test_item_creation_defaults():
    item = Item()
    assert item.status == "draft"
    assert item.deleted_at is None
    assert item.sold_price is None


def test_item_soft_delete():
    item = Item()
    assert item.deleted_at is None
    item.soft_delete()
    assert item.deleted_at is not None


def test_item_mark_sold():
    item = Item(status="listed")
    item.mark_sold(Decimal("50.00"))
    assert item.status == "sold"
    assert item.sold_price == Decimal("50.00")
    assert item.sold_at is not None


def test_item_mark_listed():
    item = Item(status="ready")
    item.mark_listed("vinted")
    assert item.status == "listed"
    assert item.platform == "vinted"
    assert item.listed_at is not None


def test_item_set_analyzing():
    item = Item(status="draft")
    item.set_analyzing()
    assert item.status == "analyzing"


def test_item_set_ready():
    item = Item(status="analyzing")
    item.set_ready()
    assert item.status == "ready"
