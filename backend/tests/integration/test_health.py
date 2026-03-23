"""Health endpoint integration tests."""

from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    """Test liveness probe returns healthy."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_ready_endpoint() -> None:
    """Test readiness probe returns ready."""
    response = client.get("/api/v1/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"
