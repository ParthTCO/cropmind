from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, FarmProfile, FarmState, AdviceHistory
from app.schemas.schemas import DashboardSummaryResponse, WeatherResponse, UserInfoResponse
from app.services.agents.farming_agents import FarmingAgents
from app.services.rag.rag_service import RAGService
from app.services.weather import get_weather_service
from app.config import get_settings
from app.services.crop_config_loader import get_crop_loader
import datetime

router = APIRouter()
settings = get_settings()
rag_service = RAGService()
weather_service = get_weather_service()

@router.get("/summary")
async def get_dashboard_summary(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.farm_profile:
        raise HTTPException(status_code=404, detail="Farm profile not found. Please onboard first.")
    
    farm = user.farm_profile
    state = db.query(FarmState).filter(FarmState.farm_id == farm.id).first()
    
    # Refresh stage detection using crop-specific config
    current_stage = FarmingAgents.get_crop_stage(farm.sowing_date, farm.crop_type)
    day_count = (datetime.date.today() - farm.sowing_date).days
    
    # Get weather for context
    weather_data = await weather_service.get_weather(farm.latitude, farm.longitude)
    weather_context = f"{weather_data['condition']}, {weather_data['temperature']}°C"
    
    # Get knowledge for the planner
    if settings.enable_rag:
        knowledge = await rag_service.get_relevant_advice(farm.crop_type, current_stage)
    else:
        knowledge = f"Standard agricultural practices for {farm.crop_type} at {current_stage} stage."
    
    # Agent Brain: Plan today's action
    raw_advice = await FarmingAgents.action_planner(current_stage, weather_context, knowledge)
    
    # Multilingual translation
    final_advice = await FarmingAgents.translate_to_language(raw_advice, user.preferred_language)
    
    # Persist advice history
    advice_entry = AdviceHistory(
        farm_id=farm.id,
        recommendation=final_advice,
        stage_at_time=current_stage,
        weather_summary=weather_context
    )
    db.add(advice_entry)
    
    # Update state
    if state:
        state.current_stage = current_stage
        state.day_count = day_count
        state.last_action = final_advice
    db.commit()
    
    # Calculate progress using crop-specific total days
    crop_loader = get_crop_loader(settings.crop_config_path)
    progress = crop_loader.calculate_progress_percentage(farm.crop_type, day_count)

    return DashboardSummaryResponse(
        current_stage=current_stage,
        day_count=day_count,
        today_action=final_advice,
        weather_summary=f"{weather_data['condition']} - {weather_data['temperature']}°C",
        progress_percentage=progress
    )


@router.get("/weather", response_model=WeatherResponse)
async def get_weather(email: str, db: Session = Depends(get_db)):
    """Get weather data for the user's farm location using real weather API"""
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not user.farm_profile:
        raise HTTPException(status_code=404, detail="User not found or no farm profile")
    
    farm = user.farm_profile
    
    # Get weather using real API (or mock if not configured)
    weather_data = await weather_service.get_weather(farm.latitude, farm.longitude)
    
    return WeatherResponse(**weather_data)


@router.get("/user-info", response_model=UserInfoResponse)
async def get_user_info(email: str, db: Session = Depends(get_db)):
    """Get user info for dashboard greeting"""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    crop_type = None
    has_farm_profile = False
    
    if user.farm_profile:
        has_farm_profile = True
        crop_type = user.farm_profile.crop_type
    
    return UserInfoResponse(
        name=user.name or settings.default_user_name,
        email=user.email,
        crop_type=crop_type,
        has_farm_profile=has_farm_profile,
        preferred_language=user.preferred_language or settings.default_language
    )

