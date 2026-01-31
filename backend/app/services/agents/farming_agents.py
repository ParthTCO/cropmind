import os
from groq import Groq
from datetime import date
from app.config import get_settings
from app.services.crop_config_loader import get_crop_loader

# Load configuration
settings = get_settings()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class FarmingAgents:
    @staticmethod
    def get_crop_stage(sowing_date: date, crop_type: str = "wheat"):
        """
        Get current crop stage based on sowing date and crop type.
        Uses external crop configuration for accurate stage detection.
        
        Args:
            sowing_date: Date when crop was sown
            crop_type: Type of crop (wheat, rice, cotton, sugarcane)
        
        Returns:
            Current stage label
        """
        days_passed = (date.today() - sowing_date).days
        
        try:
            crop_loader = get_crop_loader(settings.crop_config_path)
            return crop_loader.get_stage_label(crop_type, days_passed)
        except Exception as e:
            print(f"Error loading crop config: {e}")
            # Fallback to simple logic if config fails
            if days_passed < 10: return "Sowing/Initial"
            if days_passed < 40: return "Vegetative Growth"
            if days_passed < 70: return "Flowering"
            return "Harvest Preparation"

    @staticmethod
    async def action_planner(stage: str, weather: str, knowledge_context: str, user_query: str = None):
        """
        Plan the most important action for the farmer today.
        Uses configurable prompt template and model settings.
        
        Args:
            stage: Current crop stage
            weather: Weather situation
            knowledge_context: Agricultural knowledge from RAG
            user_query: Optional farmer query
        
        Returns:
            Action plan with reasoning
        """
        # Use prompt template from config
        prompt = settings.action_planner_prompt_template.format(
            stage=stage,
            weather=weather,
            knowledge=knowledge_context,
            query=user_query if user_query else "General daily advice requested."
        )
        
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=settings.groq_model,
            temperature=settings.groq_action_planner_temperature,
            max_tokens=settings.groq_max_tokens,
            top_p=settings.groq_top_p
        )
        return chat_completion.choices[0].message.content

    @staticmethod
    async def translate_to_language(content: str, target_lang: str):
        """
        Translate content to target language.
        Uses configurable translation temperature and prompt.
        
        Args:
            content: Content to translate
            target_lang: Target language name
        
        Returns:
            Translated content
        """
        # Skip translation if target is English
        if target_lang.lower() == "english":
            return content
        
        # Check if multilingual is enabled
        if not settings.enable_multilingual:
            return content
        
        # Use translation prompt template from config
        prompt = settings.translation_prompt_template.format(
            language=target_lang,
            content=content
        )
        
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=settings.groq_model,
            temperature=settings.groq_translation_temperature,
            max_tokens=settings.groq_max_tokens
        )
        return chat_completion.choices[0].message.content
