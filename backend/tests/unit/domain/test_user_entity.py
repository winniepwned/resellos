"""Tests for User domain entity."""

from src.domain.entities.user import User


def test_user_creation() -> None:
    """Test default user creation."""
    user = User(email="test@example.com", display_name="Test User")
    assert user.email == "test@example.com"
    assert user.display_name == "Test User"
    assert user.is_active is True
    assert user.deleted_at is None


def test_user_soft_delete() -> None:
    """Test GDPR Art. 17 soft deletion."""
    user = User(email="test@example.com")
    user.soft_delete()
    assert user.is_active is False
    assert user.deleted_at is not None
