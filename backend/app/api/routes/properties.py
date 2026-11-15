from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, or_, select

from app.api.deps import CurrentUser, DbSession, OptionalUser, ensure_roles
from app.models.enums import ListingStatus, PropertyType, UserRole
from app.models.property import Property
from app.schemas.property import (
    PropertyCreate,
    PropertyListResponse,
    PropertyRead,
    PropertyStatusUpdate,
    PropertyUpdate,
)

router = APIRouter(prefix="/properties", tags=["properties"])

NON_NULLABLE_FIELDS = {
    "title",
    "property_type",
    "district",
    "price",
    "area_unit",
    "amenities",
    "documents",
    "images",
}


def _order_by(sort: str):
    if sort == "price-asc":
        return Property.price.asc()
    if sort == "price-desc":
        return Property.price.desc()
    if sort == "area-desc":
        return Property.area.desc().nulls_last()
    return Property.created_at.desc()


@router.get("", response_model=PropertyListResponse)
async def list_properties(
    db: DbSession,
    q: str | None = None,
    district: str | None = None,
    property_type: PropertyType | None = None,
    min_price: Annotated[float | None, Query(ge=0)] = None,
    max_price: Annotated[float | None, Query(ge=0)] = None,
    sort: str = "newest",
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> PropertyListResponse:
    conditions = [Property.status == ListingStatus.approved]

    if q:
        like = f"%{q.strip()}%"
        conditions.append(
            or_(
                Property.title.ilike(like),
                Property.locality.ilike(like),
                Property.city.ilike(like),
                Property.district.ilike(like),
            )
        )
    if district:
        conditions.append(Property.district == district)
    if property_type is not None:
        conditions.append(Property.property_type == property_type)
    if min_price is not None:
        conditions.append(Property.price >= min_price)
    if max_price is not None:
        conditions.append(Property.price <= max_price)

    total = await db.scalar(select(func.count()).select_from(Property).where(*conditions))
    stmt = (
        select(Property)
        .where(*conditions)
        .order_by(_order_by(sort))
        .limit(limit)
        .offset(offset)
    )
    items = list((await db.scalars(stmt)).all())

    return PropertyListResponse(items=items, total=total or 0, limit=limit, offset=offset)


@router.get("/mine", response_model=list[PropertyRead])
async def list_my_properties(
    current_user: CurrentUser,
    db: DbSession,
    status_filter: Annotated[ListingStatus | None, Query(alias="status")] = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> list[Property]:
    ensure_roles(current_user, UserRole.seller, UserRole.builder, UserRole.admin)

    stmt = select(Property).order_by(Property.created_at.desc()).limit(limit).offset(offset)
    if current_user.role != UserRole.admin:
        stmt = stmt.where(Property.seller_id == current_user.id)
    if status_filter is not None:
        stmt = stmt.where(Property.status == status_filter)

    result = await db.scalars(stmt)
    return list(result.all())


@router.get("/admin/review", response_model=list[PropertyRead])
async def review_queue(
    current_user: CurrentUser,
    db: DbSession,
    status_filter: Annotated[ListingStatus | None, Query(alias="status")] = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 100,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> list[Property]:
    ensure_roles(current_user, UserRole.admin)

    stmt = select(Property).order_by(Property.created_at.asc()).limit(limit).offset(offset)
    if status_filter is not None:
        stmt = stmt.where(Property.status == status_filter)
    result = await db.scalars(stmt)
    return list(result.all())


@router.get("/{property_id}", response_model=PropertyRead)
async def get_property(
    property_id: UUID,
    db: DbSession,
    current_user: OptionalUser,
) -> Property:
    prop = await db.get(Property, property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found.")

    is_owner = current_user is not None and prop.seller_id == current_user.id
    is_admin = current_user is not None and current_user.role == UserRole.admin
    if prop.status != ListingStatus.approved and not (is_owner or is_admin):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found.")

    return prop


@router.post("", response_model=PropertyRead, status_code=status.HTTP_201_CREATED)
async def create_property(
    payload: PropertyCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> Property:
    ensure_roles(current_user, UserRole.seller, UserRole.builder, UserRole.admin)

    prop = Property(
        **payload.model_dump(),
        seller_id=current_user.id,
        status=ListingStatus.pending,
    )
    db.add(prop)
    await db.commit()
    await db.refresh(prop)
    await db.refresh(prop, ["seller"])
    return prop


@router.patch("/{property_id}", response_model=PropertyRead)
async def update_property(
    property_id: UUID,
    payload: PropertyUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> Property:
    prop = await db.get(Property, property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found.")

    is_admin = current_user.role == UserRole.admin
    if prop.seller_id != current_user.id and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own listings.",
        )

    data = payload.model_dump(exclude_unset=True)
    null_fields = [field for field in data if field in NON_NULLABLE_FIELDS and data[field] is None]
    if null_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"These fields cannot be null: {', '.join(sorted(null_fields))}",
        )

    for field, value in data.items():
        setattr(prop, field, value)

    if not is_admin:
        prop.status = ListingStatus.pending
        prop.rejection_reason = None

    await db.commit()
    await db.refresh(prop)
    await db.refresh(prop, ["seller"])
    return prop


@router.patch("/{property_id}/status", response_model=PropertyRead)
async def update_property_status(
    property_id: UUID,
    payload: PropertyStatusUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> Property:
    ensure_roles(current_user, UserRole.admin)

    prop = await db.get(Property, property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found.")

    prop.status = payload.status
    prop.rejection_reason = (
        payload.rejection_reason if payload.status == ListingStatus.rejected else None
    )
    await db.commit()
    await db.refresh(prop)
    await db.refresh(prop, ["seller"])
    return prop


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    prop = await db.get(Property, property_id)
    if prop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found.")

    is_admin = current_user.role == UserRole.admin
    if prop.seller_id != current_user.id and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own listings.",
        )

    await db.delete(prop)
    await db.commit()
