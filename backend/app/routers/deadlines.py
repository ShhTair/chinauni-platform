from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import date
from ..database import get_db
from ..models.university import Deadline, University
from ..schemas.university import DeadlineOut

router = APIRouter(prefix="/api/deadlines", tags=["deadlines"])


@router.get("/upcoming", response_model=List[dict])
async def upcoming_deadlines(db: Session = Depends(get_db)):
    today = date.today()
    deadlines = (
        db.query(Deadline)
        .options(joinedload(Deadline.university))
        .filter(Deadline.deadline_date >= today)
        .order_by(Deadline.deadline_date.asc())
        .limit(50)
        .all()
    )
    result = []
    for d in deadlines:
        result.append({
            "id": str(d.id),
            "university_slug": d.university.slug,
            "university_name": d.university.name,
            "university_logo": d.university.logo_url,
            "round_label": d.round_label,
            "deadline_date": d.deadline_date.isoformat() if d.deadline_date else None,
            "result_date": d.result_date.isoformat() if d.result_date else None,
            "scholarship_eligible": d.scholarship_eligible,
        })
    return result
