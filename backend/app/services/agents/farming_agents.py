import os
from groq import Groq
from datetime import date

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class FarmingAgents:
    @staticmethod
    def get_crop_stage(sowing_date: date):
        # Implementation of automated stage detection logic
        days_passed = (date.today() - sowing_date).days
        if days_passed < 10: return "Sowing/Initial"
        if days_passed < 40: return "Vegetative Growth"
        if days_passed < 70: return "Flowering"
        return "Harvest Preparation"

    @staticmethod
    async def action_planner(stage: str, weather: str, knowledge_context: str, user_query: str = None):
        prompt = f"""
        You are the Action Planner Agent for CropMind AI.
        
        CONTEXT:
        - Current Crop Stage: {stage}
        - Weather Situation: {weather}
        - Agricultural Knowledge: {knowledge_context}
        - Farmer's Input: {user_query if user_query else "General daily advice requested."}
        
        GOAL:
        Decide the SINGLE most important action for the farmer today.
        Must be short, actionable, and farmer-friendly.
        Explain WHY based on the situation.
        
        Output format:
        ACTION: [The Action]
        REASON: [Short explanation]
        """
        
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.2
        )
        return chat_completion.choices[0].message.content

    @staticmethod
    async def translate_to_language(content: str, target_lang: str):
        if target_lang.lower() == "english":
            return content
            
        prompt = f"Translate the following agricultural advice to {target_lang}. Keep the tone helpful and professional: \n\n {content}"
        
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.1
        )
        return chat_completion.choices[0].message.content
