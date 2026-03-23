"""APScheduler configuration for lightweight cron jobs."""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

scheduler = AsyncIOScheduler()


async def cleanup_expired_data() -> None:
    """DSGVO Art. 5(1)(e): Speicherbegrenzung — delete expired data."""
    # Implemented when database session is available
    pass


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
        check_external_api_health,
        CronTrigger(minute="*/5"),
        id="api_health_check",
        name="External API Health Check",
        replace_existing=True,
    )
