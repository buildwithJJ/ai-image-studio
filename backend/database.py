import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Normally this would be in a .env file, but hardcoded for the demo with local pgAdmin
SQLALCHEMY_DATABASE_URL = "postgresql+pg8000://postgres:root@localhost/ai_studio"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
