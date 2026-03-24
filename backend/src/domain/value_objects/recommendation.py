"""Sourcing recommendation enum."""
from enum import StrEnum


class Recommendation(StrEnum):
    BUY = "buy"
    SKIP = "skip"
    RISKY = "risky"
