from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/thrive_fertilizing"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Twilio
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone_number: str = ""

    # Zapier
    zapier_webhook_url: str = ""

    # Security
    jwt_secret: str = "change-me-in-production"

    # Server
    port: int = 4000
    env: str = "development"

    @property
    def is_development(self) -> bool:
        return self.env == "development"


settings = Settings()
