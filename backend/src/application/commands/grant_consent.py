"""Grant consent command and handler."""

from uuid import UUID

from src.domain.entities.consent_record import ConsentRecord
from src.domain.repositories.consent_repository import ConsentRepository


class GrantConsentCommand:
    def __init__(
        self,
        user_id: UUID,
        purpose: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> None:
        self.user_id = user_id
        self.purpose = purpose
        self.ip_address = ip_address
        self.user_agent = user_agent


class GrantConsentHandler:
    def __init__(self, consent_repo: ConsentRepository) -> None:
        self._consent_repo = consent_repo

    async def handle(self, command: GrantConsentCommand) -> ConsentRecord:
        existing = await self._consent_repo.get_by_user_and_purpose(
            command.user_id, command.purpose
        )
        if existing:
            existing.grant(command.ip_address, command.user_agent)
            return await self._consent_repo.save(existing)

        record = ConsentRecord(user_id=command.user_id, purpose=command.purpose)
        record.grant(command.ip_address, command.user_agent)
        return await self._consent_repo.save(record)
