from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["admin"])

class AdminLoginRequest(BaseModel):
    password: str

@router.post("/login")
def admin_login(payload: AdminLoginRequest):
    if payload.password != "admin123":
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": "admin_token_xyz"}
