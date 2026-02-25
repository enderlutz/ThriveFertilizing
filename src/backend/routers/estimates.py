from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.estimate import EstimateCreate, EstimateUpdate, EstimateStatusUpdate, EstimateRead
import services.estimate_service as svc

router = APIRouter(prefix="/api/estimates", tags=["estimates"])


@router.get("", response_model=list[EstimateRead])
async def list_estimates(
    status: Optional[str] = Query(None),
    customer_id: Optional[UUID] = Query(None),
    limit: int = Query(100, le=500),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    return await svc.list_estimates(db, status=status, customer_id=customer_id, limit=limit, offset=offset)


@router.post("", response_model=EstimateRead, status_code=201)
async def create_estimate(data: EstimateCreate, db: AsyncSession = Depends(get_db)):
    return await svc.create_estimate(db, data)


@router.get("/{estimate_id}", response_model=EstimateRead)
async def get_estimate(estimate_id: UUID, db: AsyncSession = Depends(get_db)):
    estimate = await svc.get_estimate(db, estimate_id)
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    return estimate


@router.put("/{estimate_id}", response_model=EstimateRead)
async def update_estimate(estimate_id: UUID, data: EstimateUpdate, db: AsyncSession = Depends(get_db)):
    estimate = await svc.update_estimate(db, estimate_id, data)
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    return estimate


@router.put("/{estimate_id}/status", response_model=EstimateRead)
async def update_estimate_status(estimate_id: UUID, data: EstimateStatusUpdate, db: AsyncSession = Depends(get_db)):
    estimate = await svc.update_estimate_status(db, estimate_id, data)
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    return estimate
