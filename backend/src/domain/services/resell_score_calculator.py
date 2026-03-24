"""Resell score calculation domain service."""
from dataclasses import dataclass
from decimal import Decimal

from src.domain.value_objects.resell_score import ResellScore


@dataclass
class MarketData:
    """Input data for score calculation."""
    avg_market_price: Decimal
    purchase_price: Decimal
    competitor_count: int
    demand_level: str  # "high", "medium", "low"
    listing_count: int


class ResellScoreCalculator:
    """Calculate resell score from market data."""

    @staticmethod
    def calculate(data: MarketData) -> ResellScore:
        profit_margin = float(
            (data.avg_market_price - data.purchase_price) / data.avg_market_price * 100
        ) if data.avg_market_price > 0 else 0

        margin_score = min(max(profit_margin * 1.5, 0), 40)

        demand_scores = {"high": 30, "medium": 20, "low": 10}
        demand_score = demand_scores.get(data.demand_level, 15)

        if data.competitor_count <= 5:
            competition_score = 30
        elif data.competitor_count <= 15:
            competition_score = 20
        elif data.competitor_count <= 30:
            competition_score = 10
        else:
            competition_score = 5

        raw_score = int(margin_score + demand_score + competition_score)
        clamped = max(1, min(100, raw_score))
        return ResellScore(value=clamped)
