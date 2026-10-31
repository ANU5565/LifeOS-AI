"""In-process application store used until database-backed repositories are added."""

from datetime import datetime, timezone
from threading import Lock
from uuid import uuid4

from app.core.security import hash_password


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class Store:
    def __init__(self) -> None:
        self._lock = Lock()
        self.users: dict[str, dict] = {}
        self.users_by_email: dict[str, str] = {}
        self.goals: dict[str, dict] = {}
        self.tasks: dict[str, dict] = {}
        self.insights: dict[str, dict] = {}

    def create_user(self, email: str, password: str, name: str) -> dict:
        with self._lock:
            normalized_email = email.lower()
            if normalized_email in self.users_by_email:
                raise ValueError("email already registered")
            user_id = str(uuid4())
            user = {
                "id": user_id,
                "email": normalized_email,
                "name": name,
                "password_hash": hash_password(password),
                "created_at": _now(),
            }
            self.users[user_id] = user
            self.users_by_email[normalized_email] = user_id
            return user.copy()

    def get_user_by_email(self, email: str) -> dict | None:
        user_id = self.users_by_email.get(email.lower())
        return self.users.get(user_id) if user_id else None

    def get_user(self, user_id: str) -> dict | None:
        return self.users.get(user_id)

    def add_goal(self, user_id: str, data: dict) -> dict:
        goal = {
            "id": str(uuid4()),
            "user_id": user_id,
            "title": data["title"],
            "description": data.get("description", ""),
            "status": data.get("status", "active"),
            "target_date": data.get("target_date"),
            "created_at": _now(),
            "updated_at": _now(),
        }
        self.goals[goal["id"]] = goal
        return goal.copy()

    def add_task(self, user_id: str, data: dict) -> dict:
        task = {
            "id": str(uuid4()),
            "user_id": user_id,
            "goal_id": data.get("goal_id"),
            "title": data["title"],
            "description": data.get("description", ""),
            "status": data.get("status", "todo"),
            "priority": data.get("priority", "medium"),
            "deadline": data.get("deadline"),
            "estimated_hours": data.get("estimated_hours"),
            "created_at": _now(),
            "updated_at": _now(),
        }
        self.tasks[task["id"]] = task
        return task.copy()

    def user_items(self, collection: dict[str, dict], user_id: str) -> list[dict]:
        return [item.copy() for item in collection.values() if item["user_id"] == user_id]

    def user_item(self, collection: dict[str, dict], item_id: str, user_id: str) -> dict | None:
        item = collection.get(item_id)
        return item.copy() if item and item["user_id"] == user_id else None

    def delete_user(self, user_id: str) -> None:
        with self._lock:
            user = self.users.pop(user_id, None)
            if user:
                self.users_by_email.pop(user["email"], None)
            for collection in (self.goals, self.tasks, self.insights):
                for item_id in [key for key, item in collection.items() if item["user_id"] == user_id]:
                    del collection[item_id]


store = Store()
