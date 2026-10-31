"""Goal endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.routes.dependencies import current_user
from app.services.store import store

router = APIRouter(prefix="/goals", tags=["goals"])


class GoalInput(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    target_date: str | None = None


@router.get("")
def list_goals(user: dict = Depends(current_user)) -> list[dict]:
    return store.user_items(store.goals, user["id"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_goal(payload: GoalInput, user: dict = Depends(current_user)) -> dict:
    return store.add_goal(user["id"], payload.model_dump())


@router.put("/{goal_id}")
def update_goal(goal_id: str, payload: GoalInput, user: dict = Depends(current_user)) -> dict:
    goal = store.goals.get(goal_id)
    if not goal or goal["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal.update(payload.model_dump(), updated_at=goal["updated_at"])
    return goal.copy()


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: str, user: dict = Depends(current_user)) -> None:
    goal = store.goals.get(goal_id)
    if not goal or goal["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Goal not found")
    del store.goals[goal_id]
