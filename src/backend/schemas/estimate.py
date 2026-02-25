from uuid import UUID
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel


class EstimateLineItemBase(BaseModel):
    description: str
    quantity: float = 1.0
    unit_price: float
    total: float
    sort_order: int = 0


class EstimateLineItemCreate(EstimateLineItemBase):
    pass


class EstimateLineItemRead(EstimateLineItemBase):
    id: UUID
    estimate_id: UUID

    model_config = {"from_attributes": True}


class EstimateBase(BaseModel):
    service_type: str
    property_address: Optional[str] = None
    property_size: Optional[int] = None
    notes: Optional[str] = None
    internal_notes: Optional[str] = None
    valid_until: Optional[date] = None


class EstimateCreate(EstimateBase):
    customer_id: UUID
    lead_id: Optional[UUID] = None
    created_by: str
    line_items: list[EstimateLineItemCreate] = []


class EstimateUpdate(BaseModel):
    service_type: Optional[str] = None
    property_address: Optional[str] = None
    property_size: Optional[int] = None
    notes: Optional[str] = None
    internal_notes: Optional[str] = None
    valid_until: Optional[date] = None
    line_items: Optional[list[EstimateLineItemCreate]] = None


class EstimateStatusUpdate(BaseModel):
    status: str
    approved_by: Optional[str] = None


class EstimateRead(EstimateBase):
    id: UUID
    customer_id: UUID
    lead_id: Optional[UUID] = None
    status: str
    subtotal: float
    tax: float
    total: float
    created_by: str
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    line_items: list[EstimateLineItemRead] = []

    model_config = {"from_attributes": True}
