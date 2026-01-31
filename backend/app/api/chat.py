from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.database import User, FarmProfile
from app.schemas.schemas import ChatQuery, ChatResponse
from app.services.agents.farming_agents import FarmingAgents
from app.services.rag.rag_service import RAGService

router = APIRouter()
rag_service = RAGService()

@router.post("/query")
async def chat_query(data: ChatQuery, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.user_email).first()
    if not user or not user.farm_profile:
        raise HTTPException(status_code=404, detail="Farm profile not found.")

    farm = user.farm_profile
    
    # Retrieve grounded knowledge
    knowledge = await rag_service.get_relevant_advice(farm.crop_type, "Current", data.question)
    
    # Reasoning loop
    raw_answer = await FarmingAgents.action_planner("Current", "Variable", knowledge, data.question)
    
    # Translate to farmer's language
    final_answer = await FarmingAgents.translate_to_language(raw_answer, user.preferred_language)

    return ChatResponse(
        answer=final_answer,
        stage="Determined by Agent",
        actionable_steps=["Check soil moisture", "Review irrigation"]
    )
