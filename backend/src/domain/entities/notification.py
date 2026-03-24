"""Notification domain entity."""
from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class Notification:
    """User notification entity."""
    id: UUID = field(default_factory=uuid4)
    user_id: UUID = field(default_factory=uuid4)
    type: str = "tip"
    title: str = ""
    message: str = ""
    item_id: UUID | None = None
    is_read: bool = False
    action_url: str | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)

    def mark_read(self) -> None:
        self.is_read = True
