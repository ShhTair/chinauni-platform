from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.application import UserSubmission, Review
from ..models.user import User

router = APIRouter(prefix="/api/admin", tags=["admin"])

class AdminLoginRequest(BaseModel):
    password: str

@router.post("/login")
def admin_login(payload: AdminLoginRequest):
    if payload.password != "admin123":
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": "admin_token_xyz"}

@router.get("/submissions")
def get_submissions(status: str = "pending", db: Session = Depends(get_db)):
    subs = db.query(UserSubmission).filter(UserSubmission.status == status).all()
    # Mock return format matching what the frontend expects
    # In a real app we'd join with University and User to return names
    res = []
    for s in subs:
        res.append({
            "id": str(s.id),
            "university_id": str(s.university_id),
            "university_name": "University ID " + str(s.university_id)[:8],
            "field_name": s.field_name,
            "old_value": s.old_value,
            "new_value": s.new_value,
            "status": s.status,
            "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None
        })
    return res

@router.put("/submissions/{sub_id}")
def update_submission(sub_id: str, payload: dict, db: Session = Depends(get_db)):
    status = payload.get("status")
    sub = db.query(UserSubmission).filter(UserSubmission.id == sub_id).first()
    if not sub:
        raise HTTPException(404, "Submission not found")
    sub.status = status
    db.commit()
    return {"ok": True}

@router.get("/reviews")
def get_reviews(approved: bool = False, db: Session = Depends(get_db)):
    return []

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": str(u.id), "email": u.email, "role": u.role, "created_at": u.created_at.isoformat() if u.created_at else None} for u in users]
