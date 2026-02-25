import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, Text, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from database import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    address_street: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address_city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address_state: Mapped[str | None] = mapped_column(String(50), nullable=True)
    address_zip: Mapped[str | None] = mapped_column(String(20), nullable=True)
    property_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, server_default="{}")
    status: Mapped[str] = mapped_column(String(50), default="active")
    preferred_contact_method: Mapped[str] = mapped_column(String(20), default="sms")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_jobs_completed: Mapped[int] = mapped_column(Integer, default=0)
    total_revenue: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_contacted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    conversations: Mapped[list["Conversation"]] = relationship("Conversation", back_populates="customer", lazy="select")
    leads: Mapped[list["Lead"]] = relationship("Lead", back_populates="customer", lazy="select")
    estimates: Mapped[list["Estimate"]] = relationship("Estimate", back_populates="customer", lazy="select")
    appointments: Mapped[list["Appointment"]] = relationship("Appointment", back_populates="customer", lazy="select")
    activities: Mapped[list["Activity"]] = relationship("Activity", back_populates="customer", lazy="select")
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="customer", lazy="select")
