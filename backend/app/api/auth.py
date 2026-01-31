from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User
from pydantic import BaseModel

router = APIRouter()

class UserLogin(BaseModel):
    email: str
    name: str = None
    uid: str

@router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Check if user exists by email
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user:
        # Create new user if they don't exist
        user = User(
            email=user_data.email,
            name=user_data.name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return {
        "message": "Login successful",
        "user_id": user.id,
        "email": user.email,
        "name": user.name
    }
