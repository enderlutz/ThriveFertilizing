from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


LEAD_STAGES = [
    "new_lead", "qualification", "estimate_needed", "estimate_sent",
    "waiting_on_customer", "scheduled", "in_progress", "completed", "follow_up"
]


class LeadBase(BaseModel):
    service_type: str
    property_address: Optional[str] = None
    property_size: Optional[int] = None
    estimated_value: Optional[float] = None
    priority: str = "medium"
    source: str = "sms"
    assigned_to: Optional[str] = None
    tags: list[str] = []
    notes: Optional[str] = None


class LeadCreate(LeadBase):
    customer_id: UUID
    stage: str = "new_lead"


class LeadUpdate(BaseModel):
    service_type: Optional[str] = None
    property_address: Optional[str] = None
    property_size: Optional[int] = None
    estimated_value: Optional[float] = None
    actual_value: Optional[float] = None
    priority: Optional[str] = None
    source: Optional[str] = None
    assigned_to: Optional[str] = None
    tags: Optional[list[str]] = None
    notes: Optional[str] = None
    estimate_id: Optional[UUID] = None
    appointment_id: Optional[UUID] = None


class LeadStageUpdate(BaseModel):
    stage: str


class LeadRead(LeadBase):
    id: UUID
    customer_id: UUID
    stage: str
    actual_value: Optional[float] = None
    estimate_id: Optional[UUID] = None
    appointment_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    last_activity_at: datetime

    model_config = {"from_attributes": True}
