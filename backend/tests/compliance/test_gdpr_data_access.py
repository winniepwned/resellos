"""GDPR Art. 15/17/20: Data subject rights tests."""
import pytest


def test_user_entity_soft_delete():
    """GDPR Art. 17: User can be soft-deleted."""
    from src.domain.entities.user import User
    user = User(email="test@test.com", display_name="Test")
    user.soft_delete()
    assert user.deleted_at is not None
    assert user.is_active is False


def test_item_entity_soft_delete():
    """GDPR Art. 17: Items can be soft-deleted."""
    from src.domain.entities.item import Item
    item = Item(title="Test", brand="Test")
    item.soft_delete()
    assert item.deleted_at is not None
