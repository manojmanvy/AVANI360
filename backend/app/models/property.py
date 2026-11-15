from datetime import datetime
from typing import TYPE_CHECKING, Any
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.enums import ListingStatus, PropertyType, enum_values

if TYPE_CHECKING:
    from app.models.enquiry import Enquiry
    from app.models.user import User


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    seller_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )

    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    property_type: Mapped[PropertyType] = mapped_column(
        Enum(PropertyType, name="property_type", values_callable=enum_values), nullable=False
    )

    district: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    city: Mapped[str | None] = mapped_column(String(80))
    locality: Mapped[str | None] = mapped_column(String(120))

    price: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    area: Mapped[float | None] = mapped_column(Numeric(12, 2))
    area_unit: Mapped[str] = mapped_column(String(20), default="sqft", nullable=False)
    dimensions: Mapped[str | None] = mapped_column(String(60))
    facing: Mapped[str | None] = mapped_column(String(20))
    ownership: Mapped[str | None] = mapped_column(String(80))

    bedrooms: Mapped[int | None] = mapped_column()
    bathrooms: Mapped[int | None] = mapped_column()

    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    map_link: Mapped[str | None] = mapped_column(String(500))

    highlights: Mapped[list[Any]] = mapped_column(JSONB, default=list, nullable=False)
    amenities: Mapped[list[Any]] = mapped_column(JSONB, default=list, nullable=False)
    documents: Mapped[list[Any]] = mapped_column(JSONB, default=list, nullable=False)
    images: Mapped[list[Any]] = mapped_column(JSONB, default=list, nullable=False)

    status: Mapped[ListingStatus] = mapped_column(
        Enum(ListingStatus, name="listing_status", values_callable=enum_values),
        default=ListingStatus.pending,
        index=True,
        nullable=False,
    )
    rejection_reason: Mapped[str | None] = mapped_column(Text)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    seller: Mapped["User"] = relationship(back_populates="properties", lazy="selectin")
    enquiries: Mapped[list["Enquiry"]] = relationship(
        back_populates="property", cascade="all, delete-orphan"
    )

    @property
    def seller_name(self) -> str:
        return self.seller.full_name if self.seller else ""

    @property
    def seller_type(self) -> str:
        if self.seller is None:
            return "Seller"
        return {
            "seller": "Seller",
            "builder": "Builder",
            "admin": "Admin",
        }.get(self.seller.role.value, "Seller")
