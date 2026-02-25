from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class CustomerBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: str
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_state: Optional[str] = None
    address_zip: Optional[str] = None
    property_size: Optional[int] = None
    tags: list[str] = []
    status: str = "active"
    preferred_contact_method: str = "sms"
    notes: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_state: Optional[str] = None
    address_zip: Optional[str] = None
    property_size: Optional[int] = None
    tags: Optional[list[str]] = None
    status: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    notes: Optional[str] = None


class CustomerRead(CustomerBase):
    id: UUID
    total_jobs_completed: int
    total_revenue: float
    created_at: datetime
    updated_at: datetime
    last_contacted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
