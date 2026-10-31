"""Privacy and account-management endpoints."""

import json

from fastapi import APIRouter, Depends, Response

from app.api.routes.auth import public_user
from app.api.routes.dependencies import current_user
from app.services.store import store

router = APIRouter(prefix="/privacy", tags=["privacy"])


@router.get("/sources")
def sources(user: dict = Depends(current_user)) -> list[dict]:
    return []


@router.get("/export")
def export_data(user: dict = Depends(current_user)) -> Response:
    data = {
        "user": public_user(user),
        "goals": store.user_items(store.goals, user["id"]),
        "tasks": store.user_items(store.tasks, user["id"]),
        "insights": store.user_items(store.insights, user["id"]),
    }
    return Response(
        content=json.dumps(data),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=lifeos-data.json"},
    )


@router.delete("/account", status_code=204)
def delete_account(user: dict = Depends(current_user)) -> None:
    store.delete_user(user["id"])
