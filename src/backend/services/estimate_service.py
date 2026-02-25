from uuid import UUID
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from models.estimate import Estimate, EstimateLineItem
from schemas.estimate import EstimateCreate, EstimateUpdate, EstimateStatusUpdate

TAX_RATE = 0.0825  # Texas 8.25%


def _calculate_totals(line_items: list) -> tuple[float, float, float]:
    subtotal = sum(item.unit_price * item.quantity for item in line_items)
    tax = round(subtotal * TAX_RATE, 2)
    total = round(subtotal + tax, 2)
    return round(subtotal, 2), tax, total


async def list_estimates(
    db: AsyncSession,
    status: Optional[str] = None,
    customer_id: Optional[UUID] = None,
    limit: int = 100,
    offset: int = 0,
) -> list[Estimate]:
    query = select(Estimate).options(selectinload(Estimate.line_items))
    if status:
        query = query.where(Estimate.status == status)
    if customer_id:
        query = query.where(Estimate.customer_id == customer_id)
    query = query.order_by(Estimate.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()


async def get_estimate(db: AsyncSession, estimate_id: UUID) -> Optional[Estimate]:
    result = await db.execute(
        select(Estimate)
        .options(selectinload(Estimate.line_items))
        .where(Estimate.id == estimate_id)
    )
    return result.scalar_one_or_none()


async def create_estimate(db: AsyncSession, data: EstimateCreate) -> Estimate:
    line_items_data = data.line_items
    estimate_data = data.model_dump(exclude={"line_items"})
    estimate = Estimate(**estimate_data)
    db.add(estimate)
    await db.flush()  # get the ID before adding line items

    line_items = []
    for i, item_data in enumerate(line_items_data):
        item = EstimateLineItem(
            estimate_id=estimate.id,
            sort_order=i,
            **item_data.model_dump(),
        )
        db.add(item)
        line_items.append(item)

    subtotal, tax, total = _calculate_totals(line_items)
    estimate.subtotal = subtotal
    estimate.tax = tax
    estimate.total = total

    await db.commit()
    await db.refresh(estimate)
    return estimate


async def update_estimate(db: AsyncSession, estimate_id: UUID, data: EstimateUpdate) -> Optional[Estimate]:
    estimate = await get_estimate(db, estimate_id)
    if not estimate:
        return None
    update_data = data.model_dump(exclude_unset=True, exclude={"line_items"})
    for field, value in update_data.items():
        setattr(estimate, field, value)

    if data.line_items is not None:
        # Replace all line items
        for item in estimate.line_items:
            await db.delete(item)
        new_items = []
        for i, item_data in enumerate(data.line_items):
            item = EstimateLineItem(estimate_id=estimate.id, sort_order=i, **item_data.model_dump())
            db.add(item)
            new_items.append(item)
        subtotal, tax, total = _calculate_totals(new_items)
        estimate.subtotal = subtotal
        estimate.tax = tax
        estimate.total = total

    await db.commit()
    await db.refresh(estimate)
    return estimate


async def update_estimate_status(db: AsyncSession, estimate_id: UUID, data: EstimateStatusUpdate) -> Optional[Estimate]:
    estimate = await get_estimate(db, estimate_id)
    if not estimate:
        return None
    estimate.status = data.status
    now = datetime.now(timezone.utc)
    if data.status == "approved" and data.approved_by:
        estimate.approved_by = data.approved_by
        estimate.approved_at = now
    elif data.status == "sent":
        estimate.sent_at = now
    elif data.status in ("accepted", "rejected"):
        estimate.responded_at = now
    await db.commit()
    await db.refresh(estimate)
    return estimate
