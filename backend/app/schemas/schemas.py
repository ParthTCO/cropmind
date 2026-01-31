from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import List, Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str
    preferred_language: str = "English"

# Weather Response Schema
class WeatherResponse(BaseModel):
    temperature: float
    feels_like: float
    condition: str
    humidity: int
    wind_speed: float
    rain_chance: int
    rain_amount: Optional[str] = None
    alert: Optional[str] = None

# User Info Response for Dashboard Greeting
class UserInfoResponse(BaseModel):
    name: str
    email: str
    crop_type: Optional[str] = None
    has_farm_profile: bool
    preferred_language: str

# Lifecycle Stage Schema
class LifecycleStageResponse(BaseModel):
    id: str
    label: str
    status: str  # completed, current, upcoming
    date: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class OnboardingRequest(BaseModel):
    user_email: EmailStr
    crop: str
    sowing_date: date
    state: str
    district: str
    village: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    preferred_language: str = "English"

class DashboardSummaryResponse(BaseModel):
    current_stage: str
    day_count: int
    today_action: str
    weather_summary: str
    progress_percentage: float

class ChatQuery(BaseModel):
    user_email: EmailStr
    question: str

class ChatResponse(BaseModel):
    answer: str
    stage: str
    actionable_steps: List[str]

class AlertResponse(BaseModel):
    id: int
    type: str
    message: str
    severity: str
    created_at: datetime
    class Config:
        from_attributes = True
