from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.lead import LeadCreate, LeadUpdate, LeadStageUpdate, LeadRead
import services.lead_service as svc

router = APIRouter(prefix="/api/leads", tags=["leads"])


@router.get("", response_model=list[LeadRead])
async def list_leads(
    stage: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    customer_id: Optional[UUID] = Query(None),
    limit: int = Query(200, le=500),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    return await svc.list_leads(db, stage=stage, assigned_to=assigned_to, customer_id=customer_id, limit=limit, offset=offset)


@router.post("", response_model=LeadRead, status_code=201)
async def create_lead(data: LeadCreate, db: AsyncSession = Depends(get_db)):
    return await svc.create_lead(db, data)


@router.get("/{lead_id}", response_model=LeadRead)
async def get_lead(lead_id: UUID, db: AsyncSession = Depends(get_db)):
    lead = await svc.get_lead(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=LeadRead)
async def update_lead(lead_id: UUID, data: LeadUpdate, db: AsyncSession = Depends(get_db)):
    lead = await svc.update_lead(db, lead_id, data)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.put("/{lead_id}/stage", response_model=LeadRead)
async def update_lead_stage(lead_id: UUID, data: LeadStageUpdate, db: AsyncSession = Depends(get_db)):
    lead = await svc.update_lead_stage(db, lead_id, data.stage)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead
