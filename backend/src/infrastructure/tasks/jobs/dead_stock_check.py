"""Celery task: Dead-Stock Detection + AI Tips."""

import structlog

from src.infrastructure.tasks.celery_app import celery_app

logger = structlog.get_logger()


@celery_app.task(name="dead_stock_check")
def run_dead_stock_check() -> dict:
    """Identify stagnating items and generate AI tips.

    Runs daily at 06:00 UTC via APScheduler.
    """
    logger.info("dead_stock_check_start")

    # In production:
    # 1. Query items with status ready/listed older than threshold
    # 2. For each dead-stock item, generate AI tips via Sonar
    # 3. Create notifications for users

    result = {
        "items_checked": 0,
        "dead_stock_found": 0,
        "notifications_created": 0,
    }

    logger.info("dead_stock_check_complete", **result)
    return result
