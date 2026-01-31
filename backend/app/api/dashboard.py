from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, FarmProfile, FarmState, AdviceHistory
from app.schemas.schemas import DashboardSummaryResponse, WeatherResponse, UserInfoResponse
from app.services.agents.farming_agents import FarmingAgents
from app.services.rag.rag_service import RAGService
import datetime
import random

router = APIRouter()
rag_service = RAGService()

@router.get("/summary")
async def get_dashboard_summary(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.farm_profile:
        raise HTTPException(status_code=404, detail="Farm profile not found. Please onboard first.")
    
    farm = user.farm_profile
    state = db.query(FarmState).filter(FarmState.farm_id == farm.id).first()
    
    # Refresh stage detection
    current_stage = FarmingAgents.get_crop_stage(farm.sowing_date)
    day_count = (datetime.date.today() - farm.sowing_date).days
    
    # Get knowledge for the planner
    knowledge = await rag_service.get_relevant_advice(farm.crop_type, current_stage)
    
    # Agent Brain: Plan today's action
    raw_advice = await FarmingAgents.action_planner(current_stage, "Clear Skies, 32°C", knowledge)
    
    # Multilingual translation
    final_advice = await FarmingAgents.translate_to_language(raw_advice, user.preferred_language)
    
    # Persist advice history
    advice_entry = AdviceHistory(
        farm_id=farm.id,
        recommendation=final_advice,
        stage_at_time=current_stage,
        weather_summary="Sunny"
    )
    db.add(advice_entry)
    
    # Update state
    if state:
        state.current_stage = current_stage
        state.day_count = day_count
        state.last_action = final_advice
    db.commit()

    return DashboardSummaryResponse(
        current_stage=current_stage,
        day_count=day_count,
        today_action=final_advice,
        weather_summary="Warm and Sunny - Good for growth",
        progress_percentage=min(day_count / 120.0 * 100, 100.0)
    )


@router.get("/weather", response_model=WeatherResponse)
async def get_weather(email: str, db: Session = Depends(get_db)):
    """Get weather data for the user's farm location"""
    user = db.query(User).filter(User.email == email).first()
    
    # For now, return mock weather data
    # In production, this would call a weather API using farm's lat/long
    conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"]
    
    # Generate somewhat realistic mock data
    temp = round(random.uniform(24, 35), 1)
    humidity = random.randint(45, 80)
    rain_chance = random.randint(0, 70)
    
    weather_data = WeatherResponse(
        temperature=temp,
        feels_like=round(temp + random.uniform(1, 3), 1),
        condition=random.choice(conditions),
        humidity=humidity,
        wind_speed=round(random.uniform(5, 20), 1),
        rain_chance=rain_chance,
        rain_amount="15-20mm" if rain_chance > 50 else None,
        alert="Rain Expected Tomorrow" if rain_chance > 50 else None
    )
    
    return weather_data


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
        name=user.name or "Farmer",
        email=user.email,
        crop_type=crop_type,
        has_farm_profile=has_farm_profile,
        preferred_language=user.preferred_language or "English"
    )

