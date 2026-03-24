"""Revoke consent command and handler."""

from uuid import UUID

from src.domain.repositories.consent_repository import ConsentRepository


class RevokeConsentCommand:
    def __init__(self, user_id: UUID, purpose: str) -> None:
        self.user_id = user_id
        self.purpose = purpose


class RevokeConsentHandler:
    def __init__(self, consent_repo: ConsentRepository) -> None:
        self._consent_repo = consent_repo

    async def handle(self, command: RevokeConsentCommand) -> bool:
        existing = await self._consent_repo.get_by_user_and_purpose(
            command.user_id, command.purpose
        )
        if not existing:
            return False
        existing.revoke()
        await self._consent_repo.save(existing)
        return True
