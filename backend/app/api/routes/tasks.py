"""Task endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.api.routes.dependencies import current_user
from app.services.store import store

router = APIRouter(prefix="/tasks", tags=["tasks"])


class TaskInput(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    goal_id: str | None = None
    priority: str = "medium"
    deadline: str | None = None
    estimated_hours: float | None = Field(default=None, ge=0)


@router.get("")
def list_tasks(goal_id: str | None = None, user: dict = Depends(current_user)) -> list[dict]:
    tasks = store.user_items(store.tasks, user["id"])
    return [task for task in tasks if not goal_id or task["goal_id"] == goal_id]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskInput, user: dict = Depends(current_user)) -> dict:
    if payload.goal_id and not store.user_item(store.goals, payload.goal_id, user["id"]):
        raise HTTPException(status_code=422, detail="Goal does not belong to the current user")
    return store.add_task(user["id"], payload.model_dump())


@router.put("/{task_id}")
def update_task(task_id: str, payload: TaskInput, user: dict = Depends(current_user)) -> dict:
    task = store.tasks.get(task_id)
    if not task or task["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Task not found")
    if payload.goal_id and not store.user_item(store.goals, payload.goal_id, user["id"]):
        raise HTTPException(status_code=422, detail="Goal does not belong to the current user")
    task.update(payload.model_dump())
    return task.copy()


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, user: dict = Depends(current_user)) -> None:
    task = store.tasks.get(task_id)
    if not task or task["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Task not found")
    del store.tasks[task_id]
