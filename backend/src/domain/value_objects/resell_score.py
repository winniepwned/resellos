"""Resell Score value object."""
from dataclasses import dataclass


@dataclass(frozen=True)
class ResellScore:
    """Resell score (1-100) with color categorization."""
    value: int

    def __post_init__(self) -> None:
        if not 1 <= self.value <= 100:
            raise ValueError(f"ResellScore must be between 1 and 100, got {self.value}")

    @property
    def color(self) -> str:
        if self.value >= 70:
            return "green"
        if self.value >= 40:
            return "yellow"
        return "red"

    @property
    def label(self) -> str:
        if self.value >= 70:
            return "Banger"
        if self.value >= 40:
            return "Okay"
        return "Ladenhueter"
