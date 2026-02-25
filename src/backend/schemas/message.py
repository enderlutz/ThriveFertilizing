from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MessageBase(BaseModel):
    sender: str  # customer, ai, team, system
    sender_name: str
    content: str


class MessageCreate(MessageBase):
    conversation_id: UUID
    ai_generated: bool = False
    needs_approval: bool = False
    twilio_sid: Optional[str] = None


class MessageRead(MessageBase):
    id: UUID
    conversation_id: UUID
    read: bool
    ai_generated: bool
    needs_approval: bool
    approved: Optional[bool] = None
    twilio_sid: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class SendMessageRequest(BaseModel):
    content: str
    sender_name: str = "Jake Bennett"
