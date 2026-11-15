from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ListingStatus, PropertyType


class PropertyBase(BaseModel):
    title: str = Field(min_length=5, max_length=160)
    description: str | None = None
    property_type: PropertyType
    district: str = Field(min_length=2, max_length=80)
    city: str | None = Field(default=None, max_length=80)
    locality: str | None = Field(default=None, max_length=120)
    price: float = Field(gt=0)
    area: float | None = Field(default=None, ge=0)
    area_unit: str = Field(default="sqft", max_length=20)
    dimensions: str | None = Field(default=None, max_length=60)
    facing: str | None = Field(default=None, max_length=20)
    ownership: str | None = Field(default=None, max_length=80)
    bedrooms: int | None = Field(default=None, ge=0)
    bathrooms: int | None = Field(default=None, ge=0)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    map_link: str | None = Field(default=None, max_length=500)
    highlights: list[Any] = Field(default_factory=list)
    amenities: list[Any] = Field(default_factory=list)
    documents: list[Any] = Field(default_factory=list)
    images: list[Any] = Field(default_factory=list)


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=5, max_length=160)
    description: str | None = None
    property_type: PropertyType | None = None
    district: str | None = Field(default=None, min_length=2, max_length=80)
    city: str | None = Field(default=None, max_length=80)
    locality: str | None = Field(default=None, max_length=120)
    price: float | None = Field(default=None, gt=0)
    area: float | None = Field(default=None, ge=0)
    area_unit: str | None = Field(default=None, max_length=20)
    dimensions: str | None = Field(default=None, max_length=60)
    facing: str | None = Field(default=None, max_length=20)
    ownership: str | None = Field(default=None, max_length=80)
    bedrooms: int | None = Field(default=None, ge=0)
    bathrooms: int | None = Field(default=None, ge=0)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    map_link: str | None = Field(default=None, max_length=500)
    highlights: list[Any] | None = None
    amenities: list[Any] | None = None
    documents: list[Any] | None = None
    images: list[Any] | None = None


class PropertyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    seller_id: UUID
    seller_name: str
    seller_type: str
    title: str
    description: str | None
    property_type: PropertyType
    district: str
    city: str | None
    locality: str | None
    price: float
    area: float | None
    area_unit: str
    dimensions: str | None
    facing: str | None
    ownership: str | None
    bedrooms: int | None
    bathrooms: int | None
    latitude: float | None
    longitude: float | None
    map_link: str | None
    highlights: list[Any]
    amenities: list[Any]
    documents: list[Any]
    images: list[Any]
    status: ListingStatus
    rejection_reason: str | None
    featured: bool
    created_at: datetime
    updated_at: datetime


class PropertyStatusUpdate(BaseModel):
    status: ListingStatus
    rejection_reason: str | None = None


class PropertyListResponse(BaseModel):
    items: list[PropertyRead]
    total: int
    limit: int
    offset: int
