"""Money value object."""
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Money:
    """Money value object with currency."""
    amount: Decimal
    currency: str = "EUR"

    def __post_init__(self) -> None:
        if self.amount < Decimal("0"):
            raise ValueError(f"Money amount cannot be negative, got {self.amount}")

    def __add__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError(f"Cannot add {self.currency} and {other.currency}")
        return Money(amount=self.amount + other.amount, currency=self.currency)

    def __sub__(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError(f"Cannot subtract {self.currency} and {other.currency}")
        return Money(amount=self.amount - other.amount, currency=self.currency)
