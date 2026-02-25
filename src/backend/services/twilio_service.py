from twilio.rest import Client
from twilio.request_validator import RequestValidator

from config import settings


def get_twilio_client() -> Client:
    return Client(settings.twilio_account_sid, settings.twilio_auth_token)


def validate_twilio_signature(url: str, params: dict, signature: str) -> bool:
    """Validate that the request actually came from Twilio."""
    if settings.is_development and not settings.twilio_auth_token:
        return True  # Skip validation in dev without credentials
    validator = RequestValidator(settings.twilio_auth_token)
    return validator.validate(url, params, signature)


async def send_sms(to: str, body: str) -> str | None:
    """Send an outbound SMS via Twilio. Returns the message SID."""
    if not settings.twilio_account_sid:
        print(f"[DEV] Would send SMS to {to}: {body}")
        return None
    client = get_twilio_client()
    message = client.messages.create(
        body=body,
        from_=settings.twilio_phone_number,
        to=to,
    )
    return message.sid
