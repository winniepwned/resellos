"""Abstract user repository (port)."""

from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.user import User


class UserRepository(ABC):
    """Abstract base class for user persistence."""

    @abstractmethod
    async def get_by_id(self, user_id: UUID) -> User | None:
        """Get user by ID."""
        ...

    @abstractmethod
    async def save(self, user: User) -> User:
        """Persist a user."""
        ...

    @abstractmethod
    async def delete(self, user_id: UUID) -> None:
        """Hard delete a user."""
        ...
