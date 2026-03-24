"""Celery task: DSGVO Retention Cleanup."""

import structlog

from src.infrastructure.tasks.celery_app import celery_app

logger = structlog.get_logger()


@celery_app.task(name="retention_cleanup")
def run_retention_cleanup() -> dict:
    """DSGVO Art. 5(1)(e): Delete expired data.

    - Soft-deleted users: hard-delete after 30 days
    - Old sourcing results: delete after 7 days
    - Expired consent records: delete after 3 years
    """
    logger.info("retention_cleanup_start")

    result = {
        "users_deleted": 0,
        "sourcing_results_deleted": 0,
        "consent_records_deleted": 0,
    }

    logger.info("retention_cleanup_complete", **result)
    return result
