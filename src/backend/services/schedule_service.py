from uuid import UUID
from typing import Optional
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
import httpx

from models.appointment import Appointment
from schemas.appointment import AppointmentCreate, AppointmentUpdate, AvailabilitySlot, BookAppointmentRequest
from config import settings


async def list_appointments(
    db: AsyncSession,
    customer_id: Optional[UUID] = None,
    status: Optional[str] = None,
) -> list[Appointment]:
    query = select(Appointment)
    if customer_id:
        query = query.where(Appointment.customer_id == customer_id)
    if status:
        query = query.where(Appointment.status == status)
    query = query.order_by(Appointment.scheduled_date.asc())
    result = await db.execute(query)
    return result.scalars().all()


async def get_availability(db: AsyncSession, start_date: datetime, days: int = 7) -> list[AvailabilitySlot]:
    """Return available time slots for the next N days based on existing appointments."""
    end_date = start_date + timedelta(days=days)
    result = await db.execute(
        select(Appointment).where(
            and_(
                Appointment.scheduled_date >= start_date,
                Appointment.scheduled_date < end_date,
                Appointment.status.in_(["scheduled", "confirmed"]),
            )
        )
    )
    booked = result.scalars().all()
    booked_times = {appt.scheduled_date for appt in booked}

    slots = []
    work_hours = [(8, 0), (9, 0), (10, 0), (11, 0), (13, 0), (14, 0), (15, 0), (16, 0)]
    current = start_date.replace(hour=0, minute=0, second=0, microsecond=0)

    for day in range(days):
        day_date = current + timedelta(days=day)
        if day_date.weekday() >= 5:  # Skip weekends
            continue
        for hour, minute in work_hours:
            slot_time = day_date.replace(hour=hour, minute=minute, tzinfo=timezone.utc)
            slots.append(AvailabilitySlot(
                date=slot_time.strftime("%Y-%m-%d"),
                start_time=slot_time.strftime("%H:%M"),
                end_time=(slot_time + timedelta(hours=1)).strftime("%H:%M"),
                available=slot_time not in booked_times,
            ))
    return slots


async def book_appointment(db: AsyncSession, data: BookAppointmentRequest) -> Appointment:
    appointment = Appointment(
        customer_id=data.customer_id,
        service_type=data.service_type,
        scheduled_date=data.scheduled_date,
        duration=data.duration,
        assigned_to=data.assigned_to,
        notes=data.notes,
    )
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)

    # Notify Zapier/Yardbook if configured
    if settings.zapier_webhook_url:
        async with httpx.AsyncClient() as client:
            await client.post(settings.zapier_webhook_url, json={
                "event": "appointment_booked",
                "customer_id": str(data.customer_id),
                "service_type": data.service_type,
                "scheduled_date": data.scheduled_date.isoformat(),
                "duration": data.duration,
                "assigned_to": data.assigned_to,
            })

    return appointment


async def update_appointment_from_zapier(db: AsyncSession, yardbook_id: str, status: str) -> Optional[Appointment]:
    """Handle status updates pushed from Yardbook via Zapier."""
    result = await db.execute(
        select(Appointment).where(Appointment.yardbook_id == yardbook_id)
    )
    appointment = result.scalar_one_or_none()
    if appointment:
        appointment.status = status
        await db.commit()
        await db.refresh(appointment)
    return appointment
