from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.appointment import AppointmentRead, AvailabilitySlot, BookAppointmentRequest
import services.schedule_service as svc

router = APIRouter(prefix="/api/schedule", tags=["schedule"])


@router.get("/availability", response_model=list[AvailabilitySlot])
async def get_availability(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
):
    start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    return await svc.get_availability(db, start_date=start, days=days)


@router.post("/book", response_model=AppointmentRead, status_code=201)
async def book_appointment(data: BookAppointmentRequest, db: AsyncSession = Depends(get_db)):
    return await svc.book_appointment(db, data)


@router.post("/zapier-webhook")
async def zapier_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Receive appointment status updates from Yardbook via Zapier."""
    payload = await request.json()
    yardbook_id = payload.get("yardbook_id")
    status = payload.get("status")
    if yardbook_id and status:
        await svc.update_appointment_from_zapier(db, yardbook_id, status)
    return {"ok": True}
