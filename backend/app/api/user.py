from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, FarmProfile
from app.schemas.schemas import UserProfileResponse, UserProfileUpdate
from pydantic import EmailStr

router = APIRouter()

@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(email: str, db: Session = Depends(get_db)):
    """Get complete user profile including farm details"""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Build response
    response_data = {
        "email": user.email,
        "name": user.name,
        "preferred_language": user.preferred_language or "English",
        "phone": None,  # Not stored in current schema
        "state": None,
        "district": None,
        "village": None,
        "crop": None,
        "sowing_date": None,
        "has_farm_profile": False
    }
    
    # Add farm profile data if exists
    if user.farm_profile:
        response_data.update({
            "state": user.farm_profile.state,
            "district": user.farm_profile.district,
            "village": user.farm_profile.village,
            "crop": user.farm_profile.crop_type,
            "sowing_date": user.farm_profile.sowing_date.isoformat(),
            "has_farm_profile": True
        })
    
    return UserProfileResponse(**response_data)


@router.put("/profile")
async def update_user_profile(data: UserProfileUpdate, db: Session = Depends(get_db)):
    """Update user profile (name, location, language)"""
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields
    if data.name is not None:
        user.name = data.name
    if data.preferred_language is not None:
        user.preferred_language = data.preferred_language
    
    # Update farm profile fields if farm exists
    if user.farm_profile:
        if data.state is not None:
            user.farm_profile.state = data.state
        if data.district is not None:
            user.farm_profile.district = data.district
        if data.village is not None:
            user.farm_profile.village = data.village
    
    db.commit()
    db.refresh(user)
    
    return {"message": "Profile updated successfully", "email": user.email}
