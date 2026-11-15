from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession, ensure_roles
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def read_me(current_user: CurrentUser) -> User:
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_me(payload: UserUpdate, current_user: CurrentUser, db: DbSession) -> User:
    data = payload.model_dump(exclude_unset=True)
    if "full_name" in data and data["full_name"] is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="full_name cannot be null",
        )

    for field, value in data.items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("", response_model=list[UserRead])
async def list_users(
    current_user: CurrentUser,
    db: DbSession,
    role: UserRole | None = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> list[User]:
    ensure_roles(current_user, UserRole.admin)

    stmt = select(User).order_by(User.created_at.desc()).limit(limit).offset(offset)
    if role is not None:
        stmt = stmt.where(User.role == role)
    result = await db.scalars(stmt)
    return list(result.all())
