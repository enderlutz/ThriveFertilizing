from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.activity import ActivityRead
import services.activity_service as svc

router = APIRouter(prefix="/api/activities", tags=["activities"])


@router.get("", response_model=list[ActivityRead])
async def list_activities(
    customer_id: Optional[UUID] = Query(None),
    type: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    return await svc.list_activities(db, customer_id=customer_id, activity_type=type, limit=limit, offset=offset)
