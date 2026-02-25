from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AppointmentBase(BaseModel):
    service_type: str
    scheduled_date: datetime
    duration: int = 60
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    yardbook_id: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    customer_id: UUID


class AppointmentUpdate(BaseModel):
    service_type: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    duration: Optional[int] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    yardbook_id: Optional[str] = None


class AppointmentRead(AppointmentBase):
    id: UUID
    customer_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AvailabilitySlot(BaseModel):
    date: str
    start_time: str
    end_time: str
    available: bool


class BookAppointmentRequest(BaseModel):
    customer_id: UUID
    service_type: str
    scheduled_date: datetime
    duration: int = 60
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
