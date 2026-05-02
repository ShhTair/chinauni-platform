from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.university import Scholarship
from ..schemas.university import ScholarshipOut, ScholarshipIn
from ..services.auth import require_moderator

router = APIRouter(prefix="/api/scholarships", tags=["scholarships"])


@router.get("", response_model=List[ScholarshipOut])
async def list_scholarships(db: Session = Depends(get_db)):
    return db.query(Scholarship).all()


@router.post("", response_model=ScholarshipOut)
async def create_scholarship(body: ScholarshipIn, db: Session = Depends(get_db), mod=Depends(require_moderator)):
    s = Scholarship(**body.model_dump())
    db.add(s)
    db.commit()
    db.refresh(s)
    return s
