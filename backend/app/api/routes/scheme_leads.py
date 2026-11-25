from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select

from app.api.deps import CurrentUser, DbSession
from app.models.enums import UserRole
from app.models.scheme_lead import SchemeLead
from app.schemas.scheme_lead import (
    SchemeLeadCreate,
    SchemeLeadListResponse,
    SchemeLeadRead,
)

router = APIRouter(prefix="/scheme-leads", tags=["scheme-leads"])


@router.post("", response_model=SchemeLeadRead, status_code=status.HTTP_201_CREATED)
async def create_scheme_lead(payload: SchemeLeadCreate, db: DbSession) -> SchemeLead:
    lead = SchemeLead(**payload.model_dump())
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return lead


@router.get("", response_model=SchemeLeadListResponse)
async def list_scheme_leads(
    current_user: CurrentUser,
    db: DbSession,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> SchemeLeadListResponse:
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can view scheme leads.",
        )

    total = await db.scalar(select(func.count()).select_from(SchemeLead))
    stmt = (
        select(SchemeLead).order_by(SchemeLead.created_at.desc()).limit(limit).offset(offset)
    )
    items = list((await db.scalars(stmt)).all())
    return SchemeLeadListResponse(items=items, total=total or 0, limit=limit, offset=offset)
