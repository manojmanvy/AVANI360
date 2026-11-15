from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import EnquiryStatus


class EnquiryCreate(BaseModel):
    property_id: UUID
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=6, max_length=20)
    email: EmailStr | None = None
    message: str | None = Field(default=None, max_length=2000)
    preferred_date: str | None = Field(default=None, max_length=40)


class EnquiryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    property_id: UUID
    property_title: str
    seller_id: UUID
    seller_name: str
    seller_type: str
    buyer_id: UUID | None
    name: str
    phone: str
    email: str | None
    message: str | None
    preferred_date: str | None
    status: EnquiryStatus
    created_at: datetime


class EnquiryStatusUpdate(BaseModel):
    status: EnquiryStatus


class EnquiryListResponse(BaseModel):
    items: list[EnquiryRead]
    total: int
    limit: int
    offset: int
