"""GDPR Art. 7: Consent tests."""
import pytest


def test_consent_not_granted_by_default():
    """GDPR-7-DEFAULT: No consent is granted by default."""
    from src.domain.entities.consent_record import ConsentRecord
    record = ConsentRecord()
    assert record.granted is False
    assert record.granted_at is None


def test_consent_can_be_granted():
    from src.domain.entities.consent_record import ConsentRecord
    record = ConsentRecord(purpose="analytics")
    record.grant(ip_address="127.0.0.1", user_agent="test")
    assert record.granted is True
    assert record.granted_at is not None
    assert record.ip_address == "127.0.0.1"


def test_consent_can_be_revoked():
    from src.domain.entities.consent_record import ConsentRecord
    record = ConsentRecord(purpose="analytics")
    record.grant()
    record.revoke()
    assert record.granted is False
    assert record.revoked_at is not None
