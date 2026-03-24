"""Tests for ProfitCalculator domain service."""
from decimal import Decimal
from src.domain.services.profit_calculator import ProfitCalculator


def test_calculate_net_profit_vinted():
    profit = ProfitCalculator.calculate_net_profit(
        sell_price=Decimal("50.00"),
        purchase_price=Decimal("20.00"),
        platform="vinted",
    )
    # 50 - 20 - (50 * 0.05) = 27.50
    assert profit == Decimal("27.50")


def test_calculate_net_profit_kleinanzeigen():
    profit = ProfitCalculator.calculate_net_profit(
        sell_price=Decimal("50.00"),
        purchase_price=Decimal("20.00"),
        platform="kleinanzeigen",
    )
    # 50 - 20 - 0 = 30
    assert profit == Decimal("30.00")


def test_calculate_net_profit_ebay():
    profit = ProfitCalculator.calculate_net_profit(
        sell_price=Decimal("50.00"),
        purchase_price=Decimal("20.00"),
        platform="ebay",
    )
    # 50 - 20 - (50 * 0.11) = 24.50
    assert profit == Decimal("24.50")


def test_calculate_roi():
    roi = ProfitCalculator.calculate_roi(
        net_profit=Decimal("30.00"),
        purchase_price=Decimal("20.00"),
    )
    assert roi == Decimal("150.0")


def test_calculate_roi_zero_purchase():
    roi = ProfitCalculator.calculate_roi(
        net_profit=Decimal("30.00"),
        purchase_price=Decimal("0"),
    )
    assert roi == Decimal("0")
