"""Authentication endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.api.routes.dependencies import current_user
from app.core.security import create_access_token, verify_password
from app.services.store import store

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def public_user(user: dict) -> dict:
    return {key: user[key] for key in ("id", "email", "name", "created_at")}


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest) -> dict:
    try:
        return public_user(store.create_user(payload.email, payload.password, payload.name))
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.post("/login")
def login(payload: LoginRequest) -> dict:
    user = store.get_user_by_email(payload.email)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return {"access_token": create_access_token(user["id"]), "token_type": "bearer"}


@router.get("/me")
def me(user: dict = Depends(current_user)) -> dict:
    return public_user(user)
