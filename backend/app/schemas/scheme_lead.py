from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SchemeLeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(pattern=r"^[6-9]\d{9}$")
    district: str = Field(min_length=2, max_length=80)
    message: str | None = Field(default=None, max_length=2000)


class SchemeLeadRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    phone: str
    district: str
    message: str | None
    is_contacted: bool
    created_at: datetime


class SchemeLeadListResponse(BaseModel):
    items: list[SchemeLeadRead]
    total: int
    limit: int
    offset: int
