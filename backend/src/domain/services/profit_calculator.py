"""Profit calculation domain service."""
from decimal import Decimal


class ProfitCalculator:
    """Calculate net profit for items."""

    PLATFORM_FEES: dict[str, Decimal] = {
        "vinted": Decimal("0.05"),
        "kleinanzeigen": Decimal("0.00"),
        "ebay": Decimal("0.11"),
    }

    @staticmethod
    def calculate_net_profit(
        sell_price: Decimal,
        purchase_price: Decimal,
        platform: str = "vinted",
    ) -> Decimal:
        fee_rate = ProfitCalculator.PLATFORM_FEES.get(platform, Decimal("0.05"))
        fees = sell_price * fee_rate
        return sell_price - purchase_price - fees

    @staticmethod
    def calculate_roi(net_profit: Decimal, purchase_price: Decimal) -> Decimal:
        if purchase_price == Decimal("0"):
            return Decimal("0")
        return (net_profit / purchase_price) * Decimal("100")
