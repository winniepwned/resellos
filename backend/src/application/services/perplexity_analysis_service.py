"""Perplexity analysis application service — orchestrates AI analysis."""

from decimal import Decimal
from uuid import UUID

import structlog

from src.domain.entities.ai_insight import AiInsight
from src.domain.repositories.ai_insight_repository import AiInsightRepository
from src.domain.repositories.item_repository import ItemRepository
from src.domain.services.profit_calculator import ProfitCalculator
from src.domain.services.resell_score_calculator import MarketData, ResellScoreCalculator
from src.infrastructure.external_apis.perplexity_search_client import PerplexitySearchClient
from src.infrastructure.external_apis.perplexity_sonar_client import PerplexitySonarClient

logger = structlog.get_logger()


class PerplexityAnalysisService:
    """Orchestrates AI analysis using Perplexity APIs and domain services."""

    def __init__(
        self,
        item_repo: ItemRepository,
        insight_repo: AiInsightRepository,
        search_client: PerplexitySearchClient,
        sonar_client: PerplexitySonarClient,
    ) -> None:
        self._item_repo = item_repo
        self._insight_repo = insight_repo
        self._search_client = search_client
        self._sonar_client = sonar_client

    async def analyze_item(self, item_id: UUID) -> AiInsight | None:
        """Run full analysis pipeline for an item."""
        item = await self._item_repo.get_by_id(item_id)
        if item is None:
            return None

        # Step 1+2: Market research via Perplexity Search
        queries = [
            f"{item.brand} {item.title} Vinted verkauft Preis",
            f"{item.brand} {item.title} eBay Kleinanzeigen Preis",
        ]
        search_results = await self._search_client.search(queries)
        total_results = sum(len(r.results) for r in search_results)

        # Step 3: Score calculation (domain service)
        market_data = MarketData(
            avg_market_price=Decimal("45.00"),
            purchase_price=item.purchase_price_ek,
            competitor_count=total_results,
            demand_level="medium" if total_results > 5 else "low",
            listing_count=total_results,
        )
        score = ResellScoreCalculator.calculate(market_data)

        # Step 4: Listing generation via Perplexity Sonar
        listing = await self._sonar_client.generate_listing(
            brand=item.brand,
            title=item.title,
            size=item.size,
            condition=item.condition,
            color=item.color,
            avg_market_price="45.00",
            platform=item.platform or "vinted",
        )

        # Calculate profit scenarios
        _profit_low = ProfitCalculator.calculate_net_profit(
            Decimal("30.00"), item.purchase_price_ek, item.platform or "vinted"
        )
        _profit_optimal = ProfitCalculator.calculate_net_profit(
            Decimal("45.00"), item.purchase_price_ek, item.platform or "vinted"
        )
        _profit_high = ProfitCalculator.calculate_net_profit(
            Decimal("65.00"), item.purchase_price_ek, item.platform or "vinted"
        )

        # Save insight
        insight = AiInsight(
            item_id=item_id,
            resell_score=score.value,
            suggested_price_low=Decimal("30.00"),
            suggested_price_optimal=Decimal("45.00"),
            suggested_price_high=Decimal("65.00"),
            generated_title=listing.get("title", ""),
            generated_description=listing.get("description", ""),
            generated_hashtags=" ".join(listing.get("hashtags", [])),
            market_reasoning=f"Score: {score.label}. {total_results} listings found.",
            competitor_count=total_results,
            avg_market_price=Decimal("45.00"),
            demand_level=market_data.demand_level,
            pipeline_version="1.0.0",
        )

        return await self._insight_repo.save(insight)
