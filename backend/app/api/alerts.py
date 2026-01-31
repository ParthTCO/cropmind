from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, Alert
from app.schemas.schemas import AlertResponse

router = APIRouter()

@router.get("/", response_model=list[AlertResponse])
async def get_alerts(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.farm_profile:
        return []
        
    alerts = db.query(Alert).filter(Alert.farm_id == user.farm_profile.id).order_by(Alert.created_at.desc()).all()
    return alerts
