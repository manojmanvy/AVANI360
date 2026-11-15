import builtins
from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import EnquiryStatus, enum_values

if TYPE_CHECKING:
    from app.models.property import Property
    from app.models.user import User


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    property_id: Mapped[UUID] = mapped_column(
        ForeignKey("properties.id", ondelete="CASCADE"), index=True, nullable=False
    )
    seller_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    buyer_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), index=True
    )

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255))
    message: Mapped[str | None] = mapped_column(Text)
    preferred_date: Mapped[str | None] = mapped_column(String(40))

    status: Mapped[EnquiryStatus] = mapped_column(
        Enum(EnquiryStatus, name="enquiry_status", values_callable=enum_values),
        default=EnquiryStatus.new,
        index=True,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    property: Mapped["Property"] = relationship(back_populates="enquiries", lazy="selectin")
    seller: Mapped["User"] = relationship(
        back_populates="enquiries_received", foreign_keys=[seller_id], lazy="selectin"
    )
    buyer: Mapped["User | None"] = relationship(
        back_populates="enquiries_sent", foreign_keys=[buyer_id]
    )

    @builtins.property
    def property_title(self) -> str:
        return self.property.title if self.property else ""

    @builtins.property
    def seller_name(self) -> str:
        return self.seller.full_name if self.seller else ""

    @builtins.property
    def seller_type(self) -> str:
        if self.seller is None:
            return "Seller"
        return {
            "seller": "Seller",
            "builder": "Builder",
            "admin": "Admin",
        }.get(self.seller.role.value, "Seller")
