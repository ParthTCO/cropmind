from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, FarmState, AdviceHistory
from app.schemas.schemas import LifecycleStageResponse
from typing import List
import datetime

router = APIRouter()

# Crop stage definitions (in days from sowing)
CROP_STAGES = [
    {"id": "planning", "label": "Planning", "start_day": -30, "end_day": 0},
    {"id": "sowing", "label": "Sowing", "start_day": 0, "end_day": 7},
    {"id": "germination", "label": "Germination", "start_day": 7, "end_day": 21},
    {"id": "vegetative", "label": "Vegetative Growth", "start_day": 21, "end_day": 60},
    {"id": "flowering", "label": "Flowering", "start_day": 60, "end_day": 90},
    {"id": "harvest", "label": "Harvest", "start_day": 90, "end_day": 120},
]

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
            "date": date_display
        })
    
    return {
        "crop": farm.crop_type,
        "sowing_date": farm.sowing_date.isoformat(),
        "day_count": day_count,
        "current_stage": current_stage_name or "Unknown",
        "total_days": 120,
        "progress_percentage": min(day_count / 120.0 * 100, 100.0),
        "timeline": timeline,
        "history": [h.recommendation for h in history[-5:]]  # Last 5 recommendations
    }

