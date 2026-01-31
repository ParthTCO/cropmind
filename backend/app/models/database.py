from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    preferred_language = Column(String, default="English") # English, Hindi, Marathi
    
    farm_profile = relationship("FarmProfile", back_populates="user", uselist=False)

class FarmProfile(Base):
    __tablename__ = "farm_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    crop_type = Column(String, nullable=False)
    sowing_date = Column(Date, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    village = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    user = relationship("User", back_populates="farm_profile")
    states = relationship("FarmState", back_populates="farm_profile")
    advice_history = relationship("AdviceHistory", back_populates="farm_profile")

class FarmState(Base):
    __tablename__ = "farm_states"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farm_profiles.id"))
    current_stage = Column(String, nullable=False) # Planning, Sowing, Growth, Flowering, Harvest
    day_count = Column(Integer, default=0)
    last_action = Column(Text)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    farm_profile = relationship("FarmProfile", back_populates="states")

class AdviceHistory(Base):
    __tablename__ = "advice_history"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farm_profiles.id"))
    recommendation = Column(Text, nullable=False)
    stage_at_time = Column(String)
    weather_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farm_profile = relationship("FarmProfile", back_populates="advice_history")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farm_profiles.id"))
    type = Column(String) # Weather, Pest, Stage
    message = Column(Text, nullable=False)
    severity = Column(String) # Info, Warning, Critical
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
