from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, Enum, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import UserRole, enum_values

if TYPE_CHECKING:
    from app.models.enquiry import Enquiry
    from app.models.property import Property


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20))
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role", values_callable=enum_values),
        default=UserRole.buyer,
        nullable=False,
    )
    district: Mapped[str | None] = mapped_column(String(80))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    reset_otp: Mapped[str | None] = mapped_column(String(255), nullable=True)
    reset_otp_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    reset_otp_attempts: Mapped[int] = mapped_column(
        Integer, default=0, server_default="0", nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    properties: Mapped[list["Property"]] = relationship(
        back_populates="seller", cascade="all, delete-orphan"
    )
    enquiries_sent: Mapped[list["Enquiry"]] = relationship(
        back_populates="buyer", foreign_keys="Enquiry.buyer_id"
    )
    enquiries_received: Mapped[list["Enquiry"]] = relationship(
        back_populates="seller", foreign_keys="Enquiry.seller_id"
    )
