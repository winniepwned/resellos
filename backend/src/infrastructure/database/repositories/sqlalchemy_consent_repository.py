"""SQLAlchemy consent repository implementation."""

from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.consent_record import ConsentRecord
from src.domain.repositories.consent_repository import ConsentRepository
from src.infrastructure.database.models.consent_record_model import ConsentRecordModel


class SqlAlchemyConsentRepository(ConsentRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: ConsentRecordModel) -> ConsentRecord:
        return ConsentRecord(
            id=model.id,
            user_id=model.user_id,
            purpose=model.purpose,
            granted=model.granted,
            granted_at=model.granted_at,
            revoked_at=model.revoked_at,
            ip_address=model.ip_address,
            user_agent=model.user_agent,
            created_at=model.created_at,
        )

    async def get_by_user_id(self, user_id: UUID) -> list[ConsentRecord]:
        stmt = (
            select(ConsentRecordModel)
            .where(ConsentRecordModel.user_id == user_id)
            .order_by(ConsentRecordModel.created_at.desc())
        )
        result = await self._session.execute(stmt)
        return [self._to_entity(m) for m in result.scalars().all()]

    async def get_by_user_and_purpose(
        self, user_id: UUID, purpose: str
    ) -> ConsentRecord | None:
        stmt = select(ConsentRecordModel).where(
            ConsentRecordModel.user_id == user_id,
            ConsentRecordModel.purpose == purpose,
        )
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def save(self, record: ConsentRecord) -> ConsentRecord:
        stmt = select(ConsentRecordModel).where(
            ConsentRecordModel.user_id == record.user_id,
            ConsentRecordModel.purpose == record.purpose,
        )
        result = await self._session.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing:
            existing.granted = record.granted
            existing.granted_at = record.granted_at
            existing.revoked_at = record.revoked_at
            existing.ip_address = record.ip_address
            existing.user_agent = record.user_agent
        else:
            model = ConsentRecordModel(
                id=record.id,
                user_id=record.user_id,
                purpose=record.purpose,
                granted=record.granted,
                granted_at=record.granted_at,
                revoked_at=record.revoked_at,
                ip_address=record.ip_address,
                user_agent=record.user_agent,
            )
            self._session.add(model)

        await self._session.commit()
        return record

    async def delete_by_user_and_purpose(self, user_id: UUID, purpose: str) -> None:
        stmt = delete(ConsentRecordModel).where(
            ConsentRecordModel.user_id == user_id,
            ConsentRecordModel.purpose == purpose,
        )
        await self._session.execute(stmt)
        await self._session.commit()
