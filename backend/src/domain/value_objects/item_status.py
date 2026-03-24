"""Item status enum."""
from enum import StrEnum


class ItemStatus(StrEnum):
    DRAFT = "draft"
    ANALYZING = "analyzing"
    READY = "ready"
    LISTED = "listed"
    SOLD = "sold"
    ARCHIVED = "archived"
