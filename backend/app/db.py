from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

# Load configuration
settings = get_settings()

# Use DATABASE_URL from config - no fallback, fail fast if not configured
DATABASE_URL = settings.database_url

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL is required but not configured. "
        "Please set the DATABASE_URL environment variable."
    )

# Create engine with configurable pool settings
engine = create_engine(
    DATABASE_URL,
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Database session dependency for FastAPI endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
