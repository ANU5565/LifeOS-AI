from fastapi.testclient import TestClient

from app.main import app
from main import app as vercel_app


def test_health_endpoint() -> None:
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "lifeos-ai",
        "version": "0.1.0",
    }


def test_vercel_entrypoint_exports_same_app() -> None:
    assert vercel_app is app
