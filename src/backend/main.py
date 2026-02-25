from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import customers, conversations, leads, estimates, tasks, activities, twilio_webhook, schedule

app = FastAPI(
    title="ThriveFertilizing API",
    description="Backend API for the ThriveFertilizing business dashboard",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(conversations.router)
app.include_router(leads.router)
app.include_router(estimates.router)
app.include_router(tasks.router)
app.include_router(activities.router)
app.include_router(twilio_webhook.router)
app.include_router(schedule.router)


@app.get("/health")
async def health():
    return {"status": "ok", "env": settings.env}
