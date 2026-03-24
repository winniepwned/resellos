"""Consent record domain entity."""
from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import UUID, uuid4


@dataclass
class ConsentRecord:
    """GDPR consent record entity."""
    id: UUID = field(default_factory=uuid4)
    user_id: UUID = field(default_factory=uuid4)
    purpose: str = ""
    granted: bool = False
    granted_at: datetime | None = None
    revoked_at: datetime | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    def grant(self, ip_address: str | None = None, user_agent: str | None = None) -> None:
        self.granted = True
        self.granted_at = datetime.now(UTC)
        self.revoked_at = None
        self.ip_address = ip_address
        self.user_agent = user_agent

    def revoke(self) -> None:
        self.granted = False
        self.revoked_at = datetime.now(UTC)
