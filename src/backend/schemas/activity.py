from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ActivityCreate(BaseModel):
    type: str
    title: str
    description: Optional[str] = None
    performed_by: str
    customer_id: Optional[UUID] = None
    lead_id: Optional[UUID] = None
    estimate_id: Optional[UUID] = None
    task_id: Optional[UUID] = None
    conversation_id: Optional[UUID] = None
    impact: Optional[str] = None


class ActivityRead(ActivityCreate):
    id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}
