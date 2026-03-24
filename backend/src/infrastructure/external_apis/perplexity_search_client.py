"""Perplexity Search API client for market research."""

import time
from dataclasses import dataclass

import httpx
import structlog

from src.config import settings

logger = structlog.get_logger()


@dataclass
class SearchResult:
    """A single search result from Perplexity."""
    title: str
    url: str
    snippet: str
    date: str | None = None


@dataclass
class SearchResponse:
    """Response from Perplexity Search API."""
    results: list[SearchResult]
    query: str


class PerplexitySearchClient:
    """Async client for Perplexity Search API — market research."""

    def __init__(self) -> None:
        self._base_url = settings.perplexity_search_url
        self._api_key = settings.perplexity_api_key
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(15.0, connect=5.0),
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json",
                },
            )
        return self._client

    async def search(
        self,
        queries: list[str],
        domain_filter: list[str] | None = None,
        recency_filter: str | None = None,
        country: str | None = None,
        max_results: int | None = None,
    ) -> list[SearchResponse]:
        """Execute search queries against Perplexity Search API.

        No PII in queries — only item data (brand, category, size, condition).
        """
        client = await self._get_client()
        domain_filter = domain_filter or settings.perplexity_search_domains
        recency_filter = recency_filter or settings.perplexity_search_recency
        country = country or settings.perplexity_search_country
        max_results = max_results or settings.perplexity_search_max_results

        responses: list[SearchResponse] = []
        for query in queries:
            start = time.monotonic()
            try:
                resp = await client.post(
                    self._base_url,
                    json={
                        "query": query,
                        "country": country,
                        "max_results": max_results,
                        "search_domain_filter": domain_filter,
                        "search_recency_filter": recency_filter,
                        "search_language_filter": ["de", "en"],
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                elapsed = time.monotonic() - start

                results = [
                    SearchResult(
                        title=r.get("title", ""),
                        url=r.get("url", ""),
                        snippet=r.get("snippet", ""),
                        date=r.get("date"),
                    )
                    for r in data.get("results", [])
                ]

                await logger.ainfo(
                    "perplexity_search",
                    query=query,
                    result_count=len(results),
                    response_time_ms=round(elapsed * 1000),
                )
                responses.append(SearchResponse(results=results, query=query))

            except httpx.HTTPStatusError as e:
                await logger.aerror(
                    "perplexity_search_error",
                    query=query,
                    status_code=e.response.status_code,
                )
                responses.append(SearchResponse(results=[], query=query))
            except httpx.RequestError:
                await logger.aerror("perplexity_search_timeout", query=query)
                responses.append(SearchResponse(results=[], query=query))

        return responses

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()
