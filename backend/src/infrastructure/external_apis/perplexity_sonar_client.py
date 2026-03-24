"""Perplexity Sonar API client for SEO listing text generation."""

import time

import httpx
import structlog

from src.config import settings

logger = structlog.get_logger()

PLATFORM_SYSTEM_PROMPTS: dict[str, str] = {
    "vinted": (
        "Du bist ein erfahrener Reselling-Experte fuer Vinted. "
        "Schreibe lockere, junge Listing-Texte die gut ankommen. "
        "Nutze Emojis sparsam. Antworte NUR mit JSON: "
        '{"title": "...", "description": "...", "hashtags": ["..."]}'
    ),
    "kleinanzeigen": (
        "Du bist ein erfahrener Verkaeufer auf Kleinanzeigen. "
        "Schreibe sachliche, informative Anzeigentexte. "
        "Antworte NUR mit JSON: "
        '{"title": "...", "description": "...", "hashtags": ["..."]}'
    ),
    "ebay": (
        "Du bist ein professioneller eBay-Verkaeufer. "
        "Schreibe professionelle, SEO-optimierte Listing-Texte. "
        "Antworte NUR mit JSON: "
        '{"title": "...", "description": "...", "hashtags": ["..."]}'
    ),
}


class PerplexitySonarClient:
    """Async client for Perplexity Sonar API — listing text generation."""

    def __init__(self) -> None:
        self._base_url = settings.perplexity_sonar_url
        self._api_key = settings.perplexity_api_key
        self._model = settings.perplexity_sonar_model
        self._search_context_size = settings.perplexity_sonar_search_context_size
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0, connect=5.0),
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json",
                },
            )
        return self._client

    async def generate_listing(
        self,
        brand: str,
        title: str,
        size: str | None,
        condition: str,
        color: str | None,
        avg_market_price: str,
        platform: str = "vinted",
    ) -> dict:
        """Generate SEO-optimized listing text. No PII in messages."""
        client = await self._get_client()
        system_prompt = PLATFORM_SYSTEM_PROMPTS.get(
            platform, PLATFORM_SYSTEM_PROMPTS["vinted"]
        )

        details = f"{brand} {title}"
        if size:
            details += f", Gr. {size}"
        details += f", Zustand: {condition}"
        if color:
            details += f", Farbe: {color}"
        details += f". Marktpreis: {avg_market_price} EUR"

        user_message = (
            f"Erstelle ein {platform}-Listing fuer: {details}. "
            "Output: JSON mit title, description, hashtags (5-10 Hashtags)."
        )

        start = time.monotonic()
        try:
            resp = await client.post(
                self._base_url,
                json={
                    "model": self._model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    "web_search_options": {
                        "search_context_size": self._search_context_size,
                    },
                },
            )
            resp.raise_for_status()
            data = resp.json()
            elapsed = time.monotonic() - start

            content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
            usage = data.get("usage", {})

            await logger.ainfo(
                "perplexity_sonar_generate",
                model=self._model,
                input_tokens=usage.get("prompt_tokens", 0),
                output_tokens=usage.get("completion_tokens", 0),
                response_time_ms=round(elapsed * 1000),
            )

            import json
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {"title": "", "description": content, "hashtags": []}

        except httpx.HTTPStatusError as e:
            await logger.aerror(
                "perplexity_sonar_error",
                status_code=e.response.status_code,
            )
            return {"title": "", "description": "", "hashtags": []}
        except httpx.RequestError:
            await logger.aerror("perplexity_sonar_timeout")
            return {"title": "", "description": "", "hashtags": []}

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()
