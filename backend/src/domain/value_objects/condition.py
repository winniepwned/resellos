"""Item condition enum."""
from enum import StrEnum


class Condition(StrEnum):
    NEW = "new"
    LIKE_NEW = "like_new"
    GOOD = "good"
    FAIR = "fair"
