"""APScheduler configuration for lightweight cron jobs."""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

scheduler = AsyncIOScheduler()


async def cleanup_expired_data() -> None:
    """DSGVO Art. 5(1)(e): Speicherbegrenzung — delete expired data."""
    from src.infrastructure.tasks.jobs.retention_cleanup import run_retention_cleanup

    run_retention_cleanup.delay()


async def check_dead_stock() -> None:
    """Daily dead-stock detection + AI tips."""
    from src.infrastructure.tasks.jobs.dead_stock_check import run_dead_stock_check

    run_dead_stock_check.delay()


async def cleanup_sourcing_results() -> None:
    """Delete old sourcing results (>7 days, DSGVO Speicherbegrenzung)."""
    from src.infrastructure.tasks.jobs.retention_cleanup import run_retention_cleanup

    run_retention_cleanup.delay()


async def check_external_api_health() -> None:
    """Check health of external API dependencies."""
    pass


def setup_scheduler() -> None:
    """Configure and start scheduled jobs."""
    scheduler.add_job(
        cleanup_expired_data,
        CronTrigger(hour=3, minute=0),
        id="retention_cleanup",
        name="DSGVO Retention Cleanup",
        replace_existing=True,
    )
    scheduler.add_job(
        cleanup_sourcing_results,
        CronTrigger(hour=4, minute=0),
        id="sourcing_cleanup",
        name="Sourcing Results Cleanup",
        replace_existing=True,
    )
    scheduler.add_job(
        check_dead_stock,
        CronTrigger(hour=6, minute=0),
        id="dead_stock_check",
        name="Dead-Stock Detection",
        replace_existing=True,
    )
    scheduler.add_job(
        check_external_api_health,
        CronTrigger(minute="*/5"),
        id="api_health_check",
        name="External API Health Check",
        replace_existing=True,
    )
