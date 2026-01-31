from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, FarmState, AdviceHistory
from app.schemas.schemas import LifecycleStageResponse
from app.config import get_settings
from app.services.crop_config_loader import get_crop_loader
from typing import List
import datetime

router = APIRouter()
settings = get_settings()

def calculate_stage_status(stage: dict, day_count: int) -> str:
    """Determine if a stage is completed, current, or upcoming"""
    if day_count >= stage["end_day"]:
        return "completed"
    elif day_count >= stage["start_day"]:
        return "current"
    else:
        return "upcoming"

def format_stage_date(sowing_date: datetime.date, day_offset: int) -> str:
    """Format a date based on sowing date and day offset"""
    stage_date = sowing_date + datetime.timedelta(days=day_offset)
    return stage_date.strftime("%b %d")

@router.get("/status")
async def get_lifecycle_status(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.farm_profile:
        return {"error": "No farm profile", "stages": []}
        
    farm = user.farm_profile
    history = db.query(AdviceHistory).filter(AdviceHistory.farm_id == farm.id).all()
    
    # Calculate day count from sowing
    day_count = (datetime.date.today() - farm.sowing_date).days
    
    # Load crop-specific stages from config
    crop_loader = get_crop_loader(settings.crop_config_path)
    crop_config = crop_loader.get_crop_config(farm.crop_type)
    CROP_STAGES = crop_config['stages']
    total_days = crop_config['total_days']
    
    # Build timeline with proper statuses
    timeline = []
    current_stage_name = None
    
    for stage in CROP_STAGES:
        status = calculate_stage_status(stage, day_count)
        
        # Format the date display
        if status == "completed":
            date_display = format_stage_date(farm.sowing_date, stage["end_day"])
        elif status == "current":
            date_display = "In Progress"
            current_stage_name = stage["label"]
        else:
            date_display = format_stage_date(farm.sowing_date, stage["start_day"])
        
        timeline.append({
            "id": stage["id"],
            "label": stage["label"],
            "status": status,
            "date": date_display,
            "description": stage.get("description", "")
        })
    
    # Calculate progress using crop-specific total days
    progress_percentage = crop_loader.calculate_progress_percentage(farm.crop_type, day_count)
    
    return {
        "crop": farm.crop_type,
        "sowing_date": farm.sowing_date.isoformat(),
        "day_count": day_count,
        "current_stage": current_stage_name or "Unknown",
        "total_days": total_days,
        "progress_percentage": progress_percentage,
        "timeline": timeline,
        "history": [h.recommendation for h in history[-5:]]  # Last 5 recommendations
    }

