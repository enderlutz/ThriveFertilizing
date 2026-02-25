from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from schemas.message import MessageRead


class ConversationBase(BaseModel):
    status: str = "active"
    ai_enabled: bool = True
    assigned_to: Optional[str] = None
    priority: str = "normal"
    tags: list[str] = []


class ConversationCreate(ConversationBase):
    customer_id: UUID


class ConversationUpdate(BaseModel):
    status: Optional[str] = None
    ai_enabled: Optional[bool] = None
    assigned_to: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[list[str]] = None


class ConversationRead(ConversationBase):
    id: UUID
    customer_id: UUID
    unread_count: int
    last_message_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationWithMessages(ConversationRead):
    messages: list[MessageRead] = []
