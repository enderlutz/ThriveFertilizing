from uuid import UUID
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.lead import Lead
from schemas.lead import LeadCreate, LeadUpdate


async def list_leads(
    db: AsyncSession,
    stage: Optional[str] = None,
    assigned_to: Optional[str] = None,
    customer_id: Optional[UUID] = None,
    limit: int = 200,
    offset: int = 0,
) -> list[Lead]:
    query = select(Lead)
    if stage:
        query = query.where(Lead.stage == stage)
    if assigned_to:
        query = query.where(Lead.assigned_to == assigned_to)
    if customer_id:
        query = query.where(Lead.customer_id == customer_id)
    query = query.order_by(Lead.last_activity_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()


async def get_lead(db: AsyncSession, lead_id: UUID) -> Optional[Lead]:
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    return result.scalar_one_or_none()


async def create_lead(db: AsyncSession, data: LeadCreate) -> Lead:
    lead = Lead(**data.model_dump())
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return lead


async def update_lead(db: AsyncSession, lead_id: UUID, data: LeadUpdate) -> Optional[Lead]:
    lead = await get_lead(db, lead_id)
    if not lead:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(lead, field, value)
    lead.last_activity_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(lead)
    return lead


async def update_lead_stage(db: AsyncSession, lead_id: UUID, stage: str) -> Optional[Lead]:
    lead = await get_lead(db, lead_id)
    if not lead:
        return None
    lead.stage = stage
    lead.last_activity_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(lead)
    return lead
