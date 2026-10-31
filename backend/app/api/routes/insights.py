"""Insight endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.api.routes.dependencies import current_user
from app.services.store import store

router = APIRouter(prefix="/insights", tags=["insights"])


class FeedbackInput(BaseModel):
    useful: bool


@router.get("")
def list_insights(user: dict = Depends(current_user)) -> list[dict]:
    return store.user_items(store.insights, user["id"])


@router.post("/generate")
def generate_insights(user: dict = Depends(current_user)) -> list[dict]:
    return []


def update_status(insight_id: str, status: str, user: dict) -> None:
    insight = store.insights.get(insight_id)
    if not insight or insight["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Insight not found")
    insight["status"] = status


@router.post("/{insight_id}/dismiss", status_code=204)
def dismiss_insight(insight_id: str, user: dict = Depends(current_user)) -> None:
    update_status(insight_id, "dismissed", user)


@router.post("/{insight_id}/snooze", status_code=204)
def snooze_insight(insight_id: str, user: dict = Depends(current_user)) -> None:
    update_status(insight_id, "snoozed", user)


@router.post("/{insight_id}/feedback", status_code=204)
def insight_feedback(
    insight_id: str,
    payload: FeedbackInput,
    user: dict = Depends(current_user),
) -> None:
    update_status(insight_id, "useful" if payload.useful else "not_useful", user)
