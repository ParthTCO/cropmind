from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import onboarding, dashboard, chat, lifecycle, alerts, auth
from app.db import engine
from app.models import database
from app.config import get_settings

# Load configuration
settings = get_settings()

# Initialize database
database.Base.metadata.create_all(bind=engine)

# Create FastAPI app with config from settings
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version
)

# Validate configuration on startup
@app.on_event("startup")
async def startup_validation():
    """Validate all required configurations on startup"""
    try:
        settings.validate_required()
        print(f"✓ Configuration validated successfully")
        print(f"✓ {settings.app_name} starting on {settings.app_host}:{settings.app_port}")
    except ValueError as e:
        print(f"✗ Configuration validation failed:")
        print(f"  {e}")
        raise

# CORS Configuration from settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_methods_list,
    allow_headers=settings.cors_headers_list,
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
    """Root endpoint with configurable welcome message"""
    return {
        "message": settings.api_welcome_message,
        "status": "healthy",
        "version": settings.app_version
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "rag_enabled": settings.enable_rag,
        "weather_api_enabled": settings.enable_weather_api,
        "multilingual_enabled": settings.enable_multilingual
    }
