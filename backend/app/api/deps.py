from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)


def get_bearer_token(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)] = None,
) -> str | None:
    if credentials is None:
        return None
    return credentials.credentials

CREDENTIALS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

DbSession = Annotated[AsyncSession, Depends(get_db)]


async def _user_from_token(token: str | None, db: AsyncSession) -> User | None:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    subject = payload.get("sub")
    if not subject:
        return None
    try:
        user_id = UUID(str(subject))
    except ValueError:
        return None
    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        return None
    return user


async def get_current_user(
    db: DbSession,
    token: Annotated[str | None, Depends(get_bearer_token)] = None,
) -> User:
    user = await _user_from_token(token, db)
    if user is None:
        raise CREDENTIALS_ERROR
    return user


async def get_optional_user(
    db: DbSession,
    token: Annotated[str | None, Depends(get_bearer_token)] = None,
) -> User | None:
    return await _user_from_token(token, db)


CurrentUser = Annotated[User, Depends(get_current_user)]
OptionalUser = Annotated[User | None, Depends(get_optional_user)]


def ensure_roles(user: User, *roles: UserRole) -> None:
    if user.role not in roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )
