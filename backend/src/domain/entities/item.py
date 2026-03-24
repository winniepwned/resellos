"""Item domain entity — aggregate root."""
from dataclasses import dataclass, field
from datetime import UTC, datetime
from decimal import Decimal
from uuid import UUID, uuid4


@dataclass
class Item:
    """Item aggregate root for reseller inventory."""
    id: UUID = field(default_factory=uuid4)
    user_id: UUID = field(default_factory=uuid4)
    title: str = ""
    brand: str = ""
    category: str | None = None
    size: str | None = None
    condition: str = "good"
    color: str | None = None
    purchase_price_ek: Decimal = Decimal("0.00")
    target_price: Decimal | None = None
    sold_price: Decimal | None = None
    status: str = "draft"
    platform: str | None = None
    notes: str | None = None
    images: list[str] = field(default_factory=list)
    listed_at: datetime | None = None
    sold_at: datetime | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    deleted_at: datetime | None = None

    def soft_delete(self) -> None:
        """Mark item as deleted (GDPR Art. 17)."""
        self.deleted_at = datetime.now(UTC)

    def mark_sold(self, sold_price: Decimal, sold_at: datetime | None = None) -> None:
        self.sold_price = sold_price
        self.sold_at = sold_at or datetime.now(UTC)
        self.status = "sold"

    def mark_listed(self, platform: str, listed_at: datetime | None = None) -> None:
        self.platform = platform
        self.listed_at = listed_at or datetime.now(UTC)
        self.status = "listed"

    def set_analyzing(self) -> None:
        self.status = "analyzing"

    def set_ready(self) -> None:
        self.status = "ready"
