"""CORS middleware configuration — explicit origin whitelist (never allow_origins=["*"])."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings


def setup_cors(app: FastAPI) -> None:
    """Configure CORS with explicit origins."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
    )
