"""Security tests: authentication bypass attempts."""
import pytest
from fastapi.testclient import TestClient


def test_items_endpoint_requires_auth(client: TestClient):
    """Accessing /items without auth should return 403."""
    response = client.get("/api/v1/items")
    assert response.status_code == 403


def test_analytics_endpoint_requires_auth(client: TestClient):
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 403


def test_sourcing_endpoint_requires_auth(client: TestClient):
    response = client.post("/api/v1/sourcing/analyze", json={"keyword": "test"})
    assert response.status_code == 403


def test_consent_endpoint_requires_auth(client: TestClient):
    response = client.get("/api/v1/consent")
    assert response.status_code == 403


def test_notifications_endpoint_requires_auth(client: TestClient):
    response = client.get("/api/v1/notifications")
    assert response.status_code == 403


def test_health_endpoint_public(client: TestClient):
    """Health endpoints should be public."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_ready_endpoint_public(client: TestClient):
    response = client.get("/api/v1/ready")
    assert response.status_code == 200
