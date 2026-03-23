"""User domain entity."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class User:
    """User aggregate root."""

    id: UUID = field(default_factory=uuid4)
    email: str = ""
    display_name: str = ""
    is_active: bool = True
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    deleted_at: datetime | None = None

    def soft_delete(self) -> None:
        """Mark user as deleted (GDPR Art. 17)."""
        self.deleted_at = datetime.utcnow()
        self.is_active = False
