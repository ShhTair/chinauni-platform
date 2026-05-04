from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..models.application import UserSubmission
from ..models.university import University
from ..services.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/api/submissions", tags=["submissions"])

class SubmissionIn(BaseModel):
    field_name: str
    old_value: Optional[str] = None
    new_value: str

class SubmissionOut(BaseModel):
    id: str
    university_id: str
    field_name: str
    new_value: str
    status: str
    submitted_at: str

@router.post("/university/{uni_id}")
async def submit_edit(
    uni_id: str,
    payload: SubmissionIn,
    db: Session = Depends(get_db),
    current_user = Depends(get_optional_user)
):
    uni = db.query(University).filter(University.id == uni_id).first()
    if not uni:
        raise HTTPException(404, "University not found")

    submission = UserSubmission(
        university_id=uni.id,
        user_id=current_user.id if current_user else None,
        field_name=payload.field_name,
        old_value=payload.old_value,
        new_value=payload.new_value,
        status="pending"
    )
    db.add(submission)
    db.commit()
    return {"ok": True, "message": "Submission received"}
