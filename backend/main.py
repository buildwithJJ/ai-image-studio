from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from pydantic import BaseModel

import models, database, auth, ai_services
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Cinematic Image Studio API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    username: str
    password: str

class PromptRequest(BaseModel):
    prompt: str

class GenerationResponse(BaseModel):
    id: int
    prompt: str
    generated_image_url: str
    created_at: str

@app.post("/register", response_model=dict)
def register(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/generate", response_model=GenerationResponse)
def generate_image(
    request: PromptRequest, 
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Call free AI Service (Pollinations.ai)
    image_url = ai_services.generate_cinematic_portrait(request.prompt)
    
    # Save to history
    new_generation = models.GenerationHistory(
        user_id=current_user.id,
        prompt=request.prompt,
        generated_image_url=image_url
    )
    db.add(new_generation)
    db.commit()
    db.refresh(new_generation)
    
    return {
        "id": new_generation.id,
        "prompt": new_generation.prompt,
        "generated_image_url": new_generation.generated_image_url,
        "created_at": str(new_generation.created_at)
    }

@app.get("/history", response_model=List[GenerationResponse])
def get_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    history = db.query(models.GenerationHistory).filter(models.GenerationHistory.user_id == current_user.id).order_by(models.GenerationHistory.created_at.desc()).all()
    return [
        {
            "id": item.id,
            "prompt": item.prompt,
            "generated_image_url": item.generated_image_url,
            "created_at": str(item.created_at)
        }
        for item in history
    ]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Cinematic Image Studio API is running"}
