"""Async client for the Open Food Facts API."""

import httpx

from src.config import settings

OFF_BASE_URL = "https://world.openfoodfacts.org/api/v2"


class OpenFoodFactsClient:
    """Async client for Open Food Facts API with rate limiting."""

    def __init__(self) -> None:
        self._client = httpx.AsyncClient(
            base_url=OFF_BASE_URL,
            headers={
                "User-Agent": f"{settings.app_name}/{settings.app_version} (contact@example.com)"
            },
            timeout=httpx.Timeout(10.0, connect=5.0),
        )

    async def get_product(self, barcode: str) -> dict | None:
        """Fetch product by barcode. Returns None if not found."""
        response = await self._client.get(f"/product/{barcode}.json")
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:
                return data["product"]
        return None

    async def search_products(
        self, query: str, page: int = 1, page_size: int = 20
    ) -> dict:
        """Search products with pagination."""
        response = await self._client.get(
            "/search.json",
            params={
                "search_terms": query,
                "page": page,
                "page_size": min(page_size, 100),
                "json": 1,
            },
        )
        response.raise_for_status()
        return response.json()

    async def close(self) -> None:
        """Close the HTTP client."""
        await self._client.aclose()
