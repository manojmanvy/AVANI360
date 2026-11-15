from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select

from app.api.deps import CurrentUser, DbSession, OptionalUser
from app.models.enquiry import Enquiry
from app.models.enums import EnquiryStatus, ListingStatus, UserRole
from app.models.property import Property
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryListResponse,
    EnquiryRead,
    EnquiryStatusUpdate,
)

router = APIRouter(prefix="/enquiries", tags=["enquiries"])


@router.post("", response_model=EnquiryRead, status_code=status.HTTP_201_CREATED)
async def create_enquiry(
    payload: EnquiryCreate,
    current_user: OptionalUser,
    db: DbSession,
) -> Enquiry:
    prop = await db.get(Property, payload.property_id)
    if prop is None or prop.status != ListingStatus.approved:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found.")

    buyer_id = current_user.id if current_user is not None else None
    if buyer_id is not None and buyer_id == prop.seller_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot enquire about your own listing.",
        )

    enquiry = Enquiry(
        **payload.model_dump(),
        seller_id=prop.seller_id,
        buyer_id=buyer_id,
        status=EnquiryStatus.new,
    )
    db.add(enquiry)
    await db.commit()
    await db.refresh(enquiry)
    await db.refresh(enquiry, ["property", "seller"])
    return enquiry


@router.get("/mine", response_model=EnquiryListResponse)
async def list_my_enquiries(
    current_user: CurrentUser,
    db: DbSession,
    status_filter: Annotated[EnquiryStatus | None, Query(alias="status")] = None,
    property_id: UUID | None = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> EnquiryListResponse:
    conditions = []
    if current_user.role in (UserRole.seller, UserRole.builder):
        conditions.append(Enquiry.seller_id == current_user.id)
    elif current_user.role != UserRole.admin:
        conditions.append(Enquiry.buyer_id == current_user.id)

    if status_filter is not None:
        conditions.append(Enquiry.status == status_filter)
    if property_id is not None:
        conditions.append(Enquiry.property_id == property_id)

    total = await db.scalar(select(func.count()).select_from(Enquiry).where(*conditions))
    stmt = (
        select(Enquiry)
        .where(*conditions)
        .order_by(Enquiry.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    items = list((await db.scalars(stmt)).all())

    return EnquiryListResponse(items=items, total=total or 0, limit=limit, offset=offset)


@router.patch("/{enquiry_id}/status", response_model=EnquiryRead)
async def update_enquiry_status(
    enquiry_id: UUID,
    payload: EnquiryStatusUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> Enquiry:
    enquiry = await db.get(Enquiry, enquiry_id)
    if enquiry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found.")

    is_admin = current_user.role == UserRole.admin
    if enquiry.seller_id != current_user.id and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update enquiries for your own listings.",
        )

    enquiry.status = payload.status
    await db.commit()
    await db.refresh(enquiry)
    await db.refresh(enquiry, ["property", "seller"])
    return enquiry
