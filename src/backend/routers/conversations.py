from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.conversation import ConversationCreate, ConversationUpdate, ConversationRead, ConversationWithMessages
from schemas.message import MessageRead, SendMessageRequest, MessageCreate
import services.conversation_service as svc
import services.twilio_service as twilio_svc
import services.customer_service as customer_svc

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


@router.get("", response_model=list[ConversationRead])
async def list_conversations(
    status: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    return await svc.list_conversations(db, status=status, assigned_to=assigned_to, limit=limit, offset=offset)


@router.post("", response_model=ConversationRead, status_code=201)
async def create_conversation(data: ConversationCreate, db: AsyncSession = Depends(get_db)):
    return await svc.create_conversation(db, data)


@router.get("/{conversation_id}", response_model=ConversationWithMessages)
async def get_conversation(conversation_id: UUID, db: AsyncSession = Depends(get_db)):
    conversation = await svc.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.post("/{conversation_id}/messages", response_model=MessageRead, status_code=201)
async def send_message(
    conversation_id: UUID,
    data: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
):
    conversation = await svc.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Get customer phone for SMS
    customer = await customer_svc.get_customer(db, conversation.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Send via Twilio
    twilio_sid = await twilio_svc.send_sms(customer.phone, data.content)

    # Store message
    message = await svc.add_message(db, MessageCreate(
        conversation_id=conversation_id,
        sender="team",
        sender_name=data.sender_name,
        content=data.content,
        twilio_sid=twilio_sid,
    ))
    return message


@router.put("/{conversation_id}/ai", response_model=ConversationRead)
async def toggle_ai(
    conversation_id: UUID,
    ai_enabled: bool,
    db: AsyncSession = Depends(get_db),
):
    conversation = await svc.update_conversation(db, conversation_id, ConversationUpdate(ai_enabled=ai_enabled))
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.put("/{conversation_id}", response_model=ConversationRead)
async def update_conversation(
    conversation_id: UUID,
    data: ConversationUpdate,
    db: AsyncSession = Depends(get_db),
):
    conversation = await svc.update_conversation(db, conversation_id, data)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation
