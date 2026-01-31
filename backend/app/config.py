"""
Comprehensive configuration management for CropMind AI Backend.
All hard-coded values are externalized here and loaded from environment variables.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
from functools import lru_cache
import os


class Settings(BaseSettings):
    """
    CropMind AI Backend Configuration.
    
    All settings are loaded from environment variables.
    Required settings will raise an error if not provided.
    Optional settings have sensible defaults for development.
    """
    
    # ===== DATABASE CONFIGURATION =====
    database_url: str  # Required, no default
    db_table_users: str = "users"
    db_table_farm_profiles: str = "farm_profiles"
    db_table_farm_states: str = "farm_states"
    db_table_advice_history: str = "advice_history"
    db_table_alerts: str = "alerts"
    db_pool_size: int = 5
    db_max_overflow: int = 10
    
    # ===== SERVICE CONFIGURATION =====
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_name: str = "CropMind AI Backend"
    app_version: str = "1.0.0"
    frontend_url: str = "http://localhost:3000"
    
    # ===== CORS CONFIGURATION =====
    cors_origins: str = "http://localhost:3000"  # Comma-separated list
    cors_allow_credentials: bool = True
    cors_methods: str = "GET,POST,PUT,DELETE,OPTIONS"
    cors_headers: str = "*"
    
    # ===== AI/LLM CONFIGURATION (GROQ) =====
    groq_api_key: str  # Required
    groq_model: str = "llama-3.3-70b-versatile"
    groq_action_planner_temperature: float = 0.2
    groq_translation_temperature: float = 0.1
    groq_max_tokens: int = 2048
    groq_top_p: float = 1.0
    
    # ===== RAG CONFIGURATION (PINECONE) =====
    pinecone_api_key: str  # Required
    pinecone_index: str = "cropmind"
    pinecone_host: Optional[str] = None  # Required for Pinecone
    pinecone_dimension: int = 1536
    pinecone_top_k: int = 3
    
    # ===== CROP CONFIGURATION =====
    crop_config_path: str = "app/config/crop_config.yaml"
    
    # ===== WEATHER API CONFIGURATION =====
    weather_api_provider: str = "openweathermap"
    weather_api_key: Optional[str] = None  # Optional, falls back to mock if not provided
    weather_api_endpoint: str = "https://api.openweathermap.org/data/2.5"
    weather_cache_ttl: int = 1800  # 30 minutes in seconds
    
    # ===== LOGGING CONFIGURATION =====
    log_level: str = "INFO"
    log_format: str = "json"  # json or text
    log_file: Optional[str] = None
    
    # ===== SECURITY CONFIGURATION =====
    jwt_secret_key: str = "change-me-in-production-use-strong-random-key"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60
    
    # ===== MESSAGES & DEFAULTS =====
    api_welcome_message: str = "CropMind AI API is online"
    default_language: str = "English"
    default_user_name: str = "Farmer"
    default_timezone: str = "UTC"
    
    # ===== PROMPTS (can be overridden with file paths) =====
    action_planner_prompt_template: str = """
You are the Action Planner Agent for CropMind AI.

CONTEXT:
- Current Crop Stage: {stage}
- Weather Situation: {weather}
- Agricultural Knowledge: {knowledge}
- Farmer's Input: {query}

GOAL:
Decide the SINGLE most important action for the farmer today.
Must be short, actionable, and farmer-friendly.
Explain WHY based on the situation.

Output format:
ACTION: [The Action]
REASON: [Short explanation]
"""
    
    translation_prompt_template: str = "Translate the following agricultural advice to {language}. Keep the tone helpful and professional:\n\n{content}"
    
    # ===== FEATURE FLAGS =====
    enable_rag: bool = True
    enable_weather_api: bool = True
    enable_multilingual: bool = True
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"  # Ignore extra env vars not defined here
    )
    
    # ===== COMPUTED PROPERTIES =====
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def cors_methods_list(self) -> List[str]:
        """Parse CORS methods from comma-separated string"""
        return [method.strip() for method in self.cors_methods.split(",")]
    
    @property
    def cors_headers_list(self) -> List[str]:
        """Parse CORS headers from comma-separated string"""
        if self.cors_headers == "*":
            return ["*"]
        return [header.strip() for header in self.cors_headers.split(",")]
    
    # ===== VALIDATION =====
    def validate_required(self) -> None:
        """
        Validate that all required configurations are present.
        Raises ValueError with clear message if any required config is missing.
        """
        errors = []
        
        if not self.database_url:
            errors.append("DATABASE_URL is required but not configured")
        
        if not self.groq_api_key:
            errors.append("GROQ_API_KEY is required but not configured")
        
        if not self.pinecone_api_key:
            errors.append("PINECONE_API_KEY is required but not configured")
        
        if self.enable_rag and not self.pinecone_host:
            errors.append("PINECONE_HOST is required when RAG is enabled")
        
        if self.enable_weather_api and not self.weather_api_key:
            errors.append("WEATHER_API_KEY is required when real weather API is enabled (or set ENABLE_WEATHER_API=false to use mock data)")
        
        if errors:
            error_msg = "Configuration validation failed:\n" + "\n".join(f"  - {err}" for err in errors)
            raise ValueError(error_msg)
    
    def get_db_url_with_table_prefix(self, table_name: str) -> str:
        """Helper to get table name with optional prefix for multi-tenancy"""
        return table_name


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    This ensures settings are loaded only once and reused throughout the application.
    """
    return Settings()
