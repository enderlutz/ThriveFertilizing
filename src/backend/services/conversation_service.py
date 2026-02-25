from uuid import UUID
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

from models.conversation import Conversation
from models.message import Message
from schemas.conversation import ConversationCreate, ConversationUpdate
from schemas.message import MessageCreate


async def list_conversations(
    db: AsyncSession,
    status: Optional[str] = None,
    assigned_to: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> list[Conversation]:
    query = select(Conversation)
    if status:
        query = query.where(Conversation.status == status)
    if assigned_to:
        query = query.where(Conversation.assigned_to == assigned_to)
    query = query.order_by(Conversation.last_message_at.desc().nullslast()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()


async def get_conversation(db: AsyncSession, conversation_id: UUID) -> Optional[Conversation]:
    result = await db.execute(
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .where(Conversation.id == conversation_id)
    )
    return result.scalar_one_or_none()


async def get_or_create_conversation(db: AsyncSession, customer_id: UUID) -> Conversation:
    result = await db.execute(
        select(Conversation)
        .where(Conversation.customer_id == customer_id, Conversation.status == "active")
        .order_by(Conversation.created_at.desc())
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        conversation = Conversation(customer_id=customer_id)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
    return conversation


async def create_conversation(db: AsyncSession, data: ConversationCreate) -> Conversation:
    conversation = Conversation(**data.model_dump())
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)
    return conversation


async def update_conversation(db: AsyncSession, conversation_id: UUID, data: ConversationUpdate) -> Optional[Conversation]:
    conversation = await get_conversation(db, conversation_id)
    if not conversation:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(conversation, field, value)
    await db.commit()
    await db.refresh(conversation)
    return conversation


async def add_message(db: AsyncSession, data: MessageCreate) -> Message:
    message = Message(**data.model_dump())
    db.add(message)
    # Update conversation last_message_at and unread count
    await db.execute(
        update(Conversation)
        .where(Conversation.id == data.conversation_id)
        .values(
            last_message_at=datetime.now(timezone.utc),
            unread_count=Conversation.unread_count + (1 if data.sender == "customer" else 0),
        )
    )
    await db.commit()
    await db.refresh(message)
    return message


async def mark_messages_read(db: AsyncSession, conversation_id: UUID) -> None:
    await db.execute(
        update(Message)
        .where(Message.conversation_id == conversation_id, Message.read == False)
        .values(read=True)
    )
    await db.execute(
        update(Conversation)
        .where(Conversation.id == conversation_id)
        .values(unread_count=0)
    )
    await db.commit()
