"""Get user consents query."""

from uuid import UUID

from src.domain.entities.consent_record import ConsentRecord
from src.domain.repositories.consent_repository import ConsentRepository


class GetUserConsentsQuery:
    def __init__(self, user_id: UUID) -> None:
        self.user_id = user_id


class GetUserConsentsHandler:
    def __init__(self, consent_repo: ConsentRepository) -> None:
        self._consent_repo = consent_repo

    async def handle(self, query: GetUserConsentsQuery) -> list[ConsentRecord]:
        return await self._consent_repo.get_by_user_id(query.user_id)
