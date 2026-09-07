from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite Database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./airbnb.db"

# Create SQLAlchemy Engine with connect_args for SQLite multi-thread safety
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal factory for database requests
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

# FastAPI dependency to yield DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
