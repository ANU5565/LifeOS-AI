from fastapi.testclient import TestClient

from app.main import app
from app.services.store import store


def setup_function() -> None:
    store.users.clear()
    store.users_by_email.clear()
    store.goals.clear()
    store.tasks.clear()
    store.insights.clear()


def test_auth_and_user_scoped_goal_flow() -> None:
    client = TestClient(app)
    register = client.post(
        "/auth/register",
        json={"email": "user@example.com", "password": "secure-pass", "name": "User"},
    )
    assert register.status_code == 201
    token = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "secure-pass"},
    ).json()["access_token"]

    assert client.get("/goals").status_code == 401
    response = client.post(
        "/goals",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Ship MVP"},
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Ship MVP"


def test_frontend_api_routes_are_registered() -> None:
    client = TestClient(app)
    assert client.get("/auth/me").status_code == 401
    assert client.get("/goals").status_code == 401
    assert client.get("/tasks").status_code == 401
    assert client.get("/insights").status_code == 401
    assert client.get("/privacy/sources").status_code == 401


def test_goal_data_is_not_visible_to_another_user() -> None:
    client = TestClient(app)
    first = client.post(
        "/auth/register",
        json={"email": "first@example.com", "password": "secure-pass", "name": "First"},
    )
    first_token = client.post(
        "/auth/login",
        json={"email": "first@example.com", "password": "secure-pass"},
    ).json()["access_token"]
    client.post(
        "/goals",
        headers={"Authorization": f"Bearer {first_token}"},
        json={"title": "Private goal"},
    )

    client.post(
        "/auth/register",
        json={"email": "second@example.com", "password": "secure-pass", "name": "Second"},
    )
    second_token = client.post(
        "/auth/login",
        json={"email": "second@example.com", "password": "secure-pass"},
    ).json()["access_token"]
    response = client.get("/goals", headers={"Authorization": f"Bearer {second_token}"})

    assert response.status_code == 200
    assert response.json() == []
