import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, Text, DateTime, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from database import Base


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    stage: Mapped[str] = mapped_column(String(50), default="new_lead")
    service_type: Mapped[str] = mapped_column(String(100), nullable=False)
    property_address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    property_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    estimated_value: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    actual_value: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    source: Mapped[str] = mapped_column(String(50), default="sms")
    assigned_to: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, server_default="{}")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    estimate_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("estimates.id", ondelete="SET NULL", use_alter=True, name="fk_leads_estimate_id"), nullable=True)
    appointment_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_activity_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    customer: Mapped["Customer"] = relationship("Customer", back_populates="leads")
    estimate: Mapped["Estimate | None"] = relationship("Estimate", foreign_keys=[estimate_id], lazy="select")
    appointment: Mapped["Appointment | None"] = relationship("Appointment", foreign_keys=[appointment_id], lazy="select")
    activities: Mapped[list["Activity"]] = relationship("Activity", back_populates="lead", lazy="select")
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="lead", lazy="select")
