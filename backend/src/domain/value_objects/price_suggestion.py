"""Price suggestion value object."""
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class PriceSuggestion:
    """Three-tier price suggestion."""
    low: Decimal
    optimal: Decimal
    high: Decimal
