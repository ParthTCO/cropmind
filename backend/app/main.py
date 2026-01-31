from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import onboarding, dashboard, chat, lifecycle, alerts, auth
from app.db import engine
from app.models import database

# Initialize database
database.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CropMind AI Backend", version="1.0.0")

# CORS Configuration for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(onboarding.router, prefix="/onboarding", tags=["Onboarding"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(lifecycle.router, prefix="/lifecycle", tags=["Lifecycle"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])

@app.get("/")
async def root():
    return {"message": "CropMind AI API is online", "status": "healthy"}
