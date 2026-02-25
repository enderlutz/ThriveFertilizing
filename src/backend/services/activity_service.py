from uuid import UUID
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.activity import Activity
from schemas.activity import ActivityCreate


async def list_activities(
    db: AsyncSession,
    customer_id: Optional[UUID] = None,
    activity_type: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> list[Activity]:
    query = select(Activity)
    if customer_id:
        query = query.where(Activity.customer_id == customer_id)
    if activity_type:
        query = query.where(Activity.type == activity_type)
    query = query.order_by(Activity.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()


async def log_activity(db: AsyncSession, data: ActivityCreate) -> Activity:
    activity = Activity(**data.model_dump())
    db.add(activity)
    await db.commit()
    await db.refresh(activity)
    return activity
