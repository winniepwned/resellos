"""Global error handler — never expose stack traces (ISO-827-ERROR)."""

import structlog
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = structlog.get_logger()


def setup_error_handlers(app: FastAPI) -> None:
    """Register global exception handlers."""

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        await logger.aerror(
            "Unhandled exception",
            path=request.url.path,
            method=request.method,
            error=str(exc),
        )
        return JSONResponse(
            status_code=500,
            content={
                "type": "about:blank",
                "title": "Internal Server Error",
                "status": 500,
                "detail": "An unexpected error occurred.",
            },
        )
