import os
import jwt
from datetime import datetime, timedelta, UTC
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.database import get_db

router = APIRouter(prefix="/api/admin", tags=["admin"])

class AdminLoginRequest(BaseModel):
    password: str

class AdminLoginResponse(BaseModel):
    token: str

@router.post("/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest):
    if payload.password != "tair_admin_2026":
        raise HTTPException(status_code=401, detail="Invalid admin password")
        
    # Generate a simple JWT token for admin
    from app.config import settings
    expire = datetime.now(UTC) + timedelta(hours=24)
    token = jwt.encode(
        {"sub": "admin", "role": "admin", "exp": expire},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return {"token": token}

