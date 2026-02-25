from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TaskBase(BaseModel):
    type: str
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    related_customer_id: Optional[UUID] = None
    related_lead_id: Optional[UUID] = None
    related_estimate_id: Optional[UUID] = None
    related_conversation_id: Optional[UUID] = None


class TaskCreate(TaskBase):
    created_by: str


class TaskStatusUpdate(BaseModel):
    status: str
    completed_by: Optional[str] = None


class TaskRead(TaskBase):
    id: UUID
    status: str
    created_by: str
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
