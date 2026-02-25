from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.message import MessageCreate
import services.customer_service as customer_svc
import services.conversation_service as conversation_svc
import services.twilio_service as twilio_svc

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.post("/twilio")
async def twilio_incoming_sms(request: Request, db: AsyncSession = Depends(get_db)):
    form = await request.form()
    params = dict(form)

    # Validate Twilio signature
    signature = request.headers.get("X-Twilio-Signature", "")
    url = str(request.url)
    if not twilio_svc.validate_twilio_signature(url, params, signature):
        raise HTTPException(status_code=403, detail="Invalid Twilio signature")

    from_phone = params.get("From", "")
    body = params.get("Body", "").strip()

    if not from_phone or not body:
        return Response(content="<Response/>", media_type="application/xml")

    # Find or create customer by phone number
    customer = await customer_svc.get_customer_by_phone(db, from_phone)
    if not customer:
        from schemas.customer import CustomerCreate
        customer = await customer_svc.create_customer(db, CustomerCreate(
            name=f"Unknown ({from_phone})",
            phone=from_phone,
        ))

    # Get or create active conversation
    conversation = await conversation_svc.get_or_create_conversation(db, customer.id)

    # Store the incoming message
    await conversation_svc.add_message(db, MessageCreate(
        conversation_id=conversation.id,
        sender="customer",
        sender_name=customer.name,
        content=body,
    ))

    # Return empty TwiML response (no auto-reply here — AI agent handles that separately)
    return Response(content="<Response/>", media_type="application/xml")
