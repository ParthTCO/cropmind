from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, FarmState, AdviceHistory, FarmTask
from app.schemas.schemas import LifecycleStageResponse, LifecycleStatusResponse, ToggleTaskRequest
from app.services.agents.farming_agents import FarmingAgents
from app.config import get_settings
from app.services.crop_config_loader import get_crop_loader
from app.services.weather import get_weather_service
from typing import List
import datetime

router = APIRouter()
settings = get_settings()
weather_service = get_weather_service()

DEFAULT_TASKS = {
    "planning": ["Soil testing", "Seed selection", "Field preparation"],
    "sowing": ["Seeds sown at optimal depth", "Initial irrigation", "Germination monitoring"],
    "germination": ["Seedling emergence monitoring", "Moisture check", "Early pest inspection"],
    "transplanting": ["Soil saturation", "Seedling selection", "Careful transplanting", "Initial post-transplant irrigation"],
    "vegetative": ["First nitrogen application", "Weed control", "Second nitrogen application", "Pest monitoring"],
    "growth": ["First nitrogen application", "Weed control", "Second nitrogen application", "Pest monitoring"],
    "emergence": ["Stand count evaluation", "Moisture monitoring", "Early weed control"],
    "tillering": ["Nitrogen top-dressing", "Irrigation management", "Weed monitoring"],
    "stem_elongation": ["Water stress management", "Foliar nutrient spray", "Stem borer inspection"],
    "flowering": ["Micronutrient spray", "Irrigation management", "Disease monitoring"],
    "ripening": ["Wait for grain filling", "Late-stage moisture monitoring", "Bird protection"],
    "boll_development": ["Pest control (Bollworms)", "Potash application", "Moisture management"],
    "maturation": ["Sugar content check (Degrees Brix)", "Irrigation withdrawal", "Pre-harvest planning"],
    "harvest": ["Harvest readiness check", "Equipment preparation", "Harvest and storage"]
}

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

@router.get("/status", response_model=LifecycleStatusResponse)
async def get_lifecycle_status(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.farm_profile:
        raise HTTPException(status_code=404, detail="Farm profile not found")
        
    farm = user.farm_profile
    history = db.query(AdviceHistory).filter(AdviceHistory.farm_id == farm.id).all()
    
    # Calculate day count from sowing
    day_count = (datetime.date.today() - farm.sowing_date).days
    
    # Load crop-specific stages from config
    crop_loader = get_crop_loader(settings.crop_config_path)
    crop_config = crop_loader.get_crop_config(farm.crop_type)
    CROP_STAGES = crop_config['stages']
    total_days = crop_config['total_days']
    
    # Fetch existing tasks
    existing_tasks = db.query(FarmTask).filter(FarmTask.farm_id == farm.id).all()
    tasks_by_stage = {}
    for task in existing_tasks:
        if task.stage_id not in tasks_by_stage:
            tasks_by_stage[task.stage_id] = []
        tasks_by_stage[task.stage_id].append(task)
    
    # Build timeline with proper statuses and tasks
    timeline = []
    current_stage_name = None
    current_stage_id = None
    
    for stage in CROP_STAGES:
        status = calculate_stage_status(stage, day_count)
        stage_id = stage["id"]
        
        # Initialize tasks if they don't exist for this stage
        stage_tasks = tasks_by_stage.get(stage_id, [])
        if not stage_tasks and stage_id in DEFAULT_TASKS:
            for task_name in DEFAULT_TASKS[stage_id]:
                new_task = FarmTask(farm_id=farm.id, stage_id=stage_id, task_name=task_name, is_completed=False)
                db.add(new_task)
            db.commit()
            # Re-fetch tasks after commit
            stage_tasks = db.query(FarmTask).filter(FarmTask.farm_id == farm.id, FarmTask.stage_id == stage_id).all()
        
        # Format the date display
        if status == "completed":
            date_display = format_stage_date(farm.sowing_date, stage["end_day"])
        elif status == "current":
            date_display = "In Progress"
            current_stage_name = stage["label"]
            current_stage_id = stage_id
        else:
            date_display = format_stage_date(farm.sowing_date, stage["start_day"])
        
        # Get AI Summary for each stage (briefly)
        knowledge = f"Farming practices for {farm.crop_type} at {stage['label']} stage."
        raw_stage_ai = await FarmingAgents.action_planner(stage['label'], "Normal", knowledge, "Provide one sentence of key advice for this stage.")
        stage_ai_summary = await FarmingAgents.translate_to_language(raw_stage_ai, user.preferred_language)

        timeline.append({
            "id": stage_id,
            "label": stage["label"],
            "status": status,
            "date": date_display,
            "tasks": [{"id": t.id, "task_name": t.task_name, "is_completed": t.is_completed} for t in stage_tasks],
            "ai_summary": stage_ai_summary
        })
    
    # Generate AI Summary for "What's Next"
    ai_summary = None
    if current_stage_name:
        weather_data = await weather_service.get_weather(farm.latitude, farm.longitude)
        weather_context = f"{weather_data['condition']}, {weather_data['temperature']}°C"
        
        # Knowledge context for the planner
        knowledge = f"Farming practices for {farm.crop_type} at {current_stage_name} stage."
        
        # Get AI recommendation
        raw_ai = await FarmingAgents.action_planner(current_stage_name, weather_context, knowledge, "What should I do next in this stage?")
        ai_summary = await FarmingAgents.translate_to_language(raw_ai, user.preferred_language)
    
    # Calculate progress
    progress_percentage = crop_loader.calculate_progress_percentage(farm.crop_type, day_count)
    
    return {
        "crop": farm.crop_type,
        "sowing_date": farm.sowing_date,
        "day_count": day_count,
        "current_stage": current_stage_name or "Unknown",
        "total_days": total_days,
        "progress_percentage": progress_percentage,
        "timeline": timeline,
        "ai_summary": ai_summary,
        "history": [h.recommendation for h in history[-5:]]
    }

@router.post("/toggle-task")
async def toggle_task(data: ToggleTaskRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.user_email).first()
    if not user or not user.farm_profile:
        raise HTTPException(status_code=404, detail="Farm profile not found")
    
    task = db.query(FarmTask).filter(FarmTask.id == data.task_id, FarmTask.farm_id == user.farm_profile.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.is_completed = not task.is_completed
    db.commit()
    
    return {"status": "success", "is_completed": task.is_completed}

@router.post("/advance-stage")
async def advance_stage(user_email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_email).first()
    if not user or not user.farm_profile:
        raise HTTPException(status_code=404, detail="Farm profile not found")
    
    farm = user.farm_profile
    day_count = (datetime.date.today() - farm.sowing_date).days
    
    # Load crop stages
    crop_loader = get_crop_loader(settings.crop_config_path)
    crop_config = crop_loader.get_crop_config(farm.crop_type)
    CROP_STAGES = crop_config['stages']
    
    # Find current stage end day
    current_stage_end = None
    for stage in CROP_STAGES:
        if day_count >= stage["start_day"] and day_count < stage["end_day"]:
            current_stage_end = stage["end_day"]
            break
    
    if current_stage_end is not None:
        # Shift sowing date back so today is at the beginning of the next stage
        # New day count should be current_stage_end
        days_to_add = current_stage_end - day_count
        farm.sowing_date = farm.sowing_date - datetime.timedelta(days=days_to_add)
        db.commit()
        return {"status": "success", "new_day_count": current_stage_end}
    
    return {"status": "already_at_latest", "day_count": day_count}

