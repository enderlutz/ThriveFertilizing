from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.customer import CustomerCreate, CustomerUpdate, CustomerRead
import services.customer_service as svc

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("", response_model=list[CustomerRead])
async def list_customers(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    return await svc.list_customers(db, search=search, status=status, limit=limit, offset=offset)


@router.post("", response_model=CustomerRead, status_code=201)
async def create_customer(data: CustomerCreate, db: AsyncSession = Depends(get_db)):
    return await svc.create_customer(db, data)


@router.get("/{customer_id}", response_model=CustomerRead)
async def get_customer(customer_id: UUID, db: AsyncSession = Depends(get_db)):
    customer = await svc.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/{customer_id}", response_model=CustomerRead)
async def update_customer(customer_id: UUID, data: CustomerUpdate, db: AsyncSession = Depends(get_db)):
    customer = await svc.update_customer(db, customer_id, data)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.delete("/{customer_id}", status_code=204)
async def delete_customer(customer_id: UUID, db: AsyncSession = Depends(get_db)):
    deleted = await svc.delete_customer(db, customer_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Customer not found")
