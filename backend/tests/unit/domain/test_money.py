"""Tests for Money value object."""
import pytest
from decimal import Decimal
from src.domain.value_objects.money import Money


def test_money_creation():
    m = Money(amount=Decimal("10.50"))
    assert m.amount == Decimal("10.50")
    assert m.currency == "EUR"


def test_money_custom_currency():
    m = Money(amount=Decimal("100"), currency="USD")
    assert m.currency == "USD"


def test_negative_amount_raises():
    with pytest.raises(ValueError):
        Money(amount=Decimal("-1"))


def test_money_addition():
    a = Money(amount=Decimal("10"))
    b = Money(amount=Decimal("5"))
    result = a + b
    assert result.amount == Decimal("15")


def test_money_subtraction():
    a = Money(amount=Decimal("10"))
    b = Money(amount=Decimal("3"))
    result = a - b
    assert result.amount == Decimal("7")


def test_different_currency_addition_raises():
    a = Money(amount=Decimal("10"), currency="EUR")
    b = Money(amount=Decimal("5"), currency="USD")
    with pytest.raises(ValueError):
        a + b


def test_money_is_immutable():
    m = Money(amount=Decimal("10"))
    with pytest.raises(AttributeError):
        m.amount = Decimal("20")
