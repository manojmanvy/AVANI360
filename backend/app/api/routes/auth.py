import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import CurrentUser, DbSession
from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    Token,
    VerifyOtpRequest,
)
from app.schemas.user import UserRead
from app.services.email import send_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])

MAX_OTP_ATTEMPTS = 5


def _clear_reset_otp(user: User) -> None:
    user.reset_otp = None
    user.reset_otp_expires_at = None
    user.reset_otp_attempts = 0


async def _validate_reset_otp(user: User, submitted: str, db: AsyncSession) -> None:
    if not user.reset_otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP. Please request a new code.",
        )

    now = datetime.now(UTC)
    if user.reset_otp_expires_at is None or now > user.reset_otp_expires_at:
        _clear_reset_otp(user)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new code.",
        )

    if not verify_password(submitted, user.reset_otp):
        user.reset_otp_attempts += 1
        if user.reset_otp_attempts >= MAX_OTP_ATTEMPTS:
            _clear_reset_otp(user)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect OTP. Please request a new code.",
        )


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: DbSession) -> User:
    if payload.role == UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin accounts cannot be self-registered.",
        )

    email = payload.email.lower()
    existing = await db.scalar(select(User).where(User.email == email))
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        full_name=payload.full_name.strip(),
        email=email,
        phone=payload.phone.strip(),
        password_hash=hash_password(payload.password),
        role=payload.role,
        district=payload.district,
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from None
    await db.refresh(user)
    return user


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db: DbSession) -> Token:
    email = payload.email.lower()
    user = await db.scalar(select(User).where(User.email == email))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is disabled.",
        )

    token = create_access_token(subject=str(user.id), role=user.role.value)
    return Token(access_token=token, user=UserRead.model_validate(user))


@router.get("/me", response_model=UserRead)
async def read_current_user(current_user: CurrentUser) -> User:
    return current_user


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(payload: ForgotPasswordRequest, db: DbSession) -> MessageResponse:
    email = payload.email.lower().strip()
    user = await db.scalar(select(User).where(User.email == email))

    generic_msg = f"If {email} is registered with AVANI360, you will receive a 6-digit OTP code."
    if user is None or not user.is_active:
        return MessageResponse(message=generic_msg)

    otp = f"{secrets.randbelow(900000) + 100000:06d}"
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.otp_expire_minutes)

    user.reset_otp = hash_password(otp)
    user.reset_otp_expires_at = expires_at
    user.reset_otp_attempts = 0
    await db.commit()

    sent, status_desc = await send_otp_email(user.email, otp, user.full_name)
    dev_otp = otp if not sent and settings.environment != "production" else None

    if not sent:
        return MessageResponse(
            ok=True,
            message=f"OTP generated for {email}. ({status_desc})",
            dev_otp=dev_otp,
        )

    return MessageResponse(
        ok=True,
        message=f"Verification OTP sent to {email}. Please check your inbox and spam folder.",
        dev_otp=None,
    )


@router.post("/verify-otp", response_model=MessageResponse)
async def verify_otp(payload: VerifyOtpRequest, db: DbSession) -> MessageResponse:
    email = payload.email.lower().strip()
    user = await db.scalar(select(User).where(User.email == email))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP. Please request a new code.",
        )

    await _validate_reset_otp(user, payload.otp.strip(), db)
    return MessageResponse(ok=True, message="OTP verified successfully.")


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(payload: ResetPasswordRequest, db: DbSession) -> MessageResponse:
    email = payload.email.lower().strip()
    user = await db.scalar(select(User).where(User.email == email))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP request. Please request a new code.",
        )

    await _validate_reset_otp(user, payload.otp.strip(), db)
    user.password_hash = hash_password(payload.new_password)
    _clear_reset_otp(user)
    await db.commit()

    return MessageResponse(
        ok=True,
        message="Your password has been successfully reset. You can now login.",
    )

