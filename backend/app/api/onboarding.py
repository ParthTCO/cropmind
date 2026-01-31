from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, FarmProfile, FarmState, AdviceHistory
from app.schemas.schemas import OnboardingRequest, UserResponse
from app.services.agents.farming_agents import FarmingAgents
import datetime

router = APIRouter()

@router.post("/setup")
async def setup_onboarding(data: OnboardingRequest, db: Session = Depends(get_db)):
    # Find or create user
    user = db.query(User).filter(User.email == data.user_email).first()
    if not user:
        user = User(email=data.user_email, name="Farmer", preferred_language=data.preferred_language)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create farm profile
    farm = FarmProfile(
        user_id=user.id,
        crop_type=data.crop,
        sowing_date=data.sowing_date,
        state=data.state,
        district=data.district,
        village=data.village,
        latitude=data.latitude,
        longitude=data.longitude
    )
    db.add(farm)
    db.commit()
    db.refresh(farm)

    # Initialize farm state
    stage = FarmingAgents.get_crop_stage(data.sowing_date)
    farm_state = FarmState(
        farm_id=farm.id,
        current_stage=stage,
        day_count=(datetime.date.today() - data.sowing_date).days,
        last_action="Initial setup completed. Welcome to CropMind AI!"
    )
    db.add(farm_state)
    db.commit()

    return {"message": "Onboarding successful", "farm_id": farm.id}
