from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models.application import Review, UserSubmission
from ..models.user import User
from ..schemas.application import ReviewOut, SubmissionOut
from ..services.auth import require_moderator

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/submissions", response_model=List[SubmissionOut])
async def list_submissions(
    status: str = "pending",
    db: Session = Depends(get_db),
    mod=Depends(require_moderator)
):
    return db.query(UserSubmission).filter(UserSubmission.status == status).all()


@router.put("/submissions/{sub_id}")
async def review_submission(
    sub_id: str,
    action: str,  # approve | reject
    moderator_note: str = "",
    db: Session = Depends(get_db),
    mod=Depends(require_moderator)
):
    sub = db.query(UserSubmission).filter(UserSubmission.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404)
    sub.status = "approved" if action == "approve" else "rejected"
    sub.moderator_note = moderator_note

    if action == "approve":
        # Apply the edit to the university
        from ..models.university import University
        uni = db.query(University).filter(University.id == sub.university_id).first()
        if uni and hasattr(uni, sub.field_name):
            setattr(uni, sub.field_name, sub.new_value)

    db.commit()
    return {"status": sub.status}


@router.get("/reviews", response_model=List[ReviewOut])
async def list_reviews(approved: bool = False, db: Session = Depends(get_db), mod=Depends(require_moderator)):
    reviews = db.query(Review).options(joinedload(Review.user)).filter(Review.approved == approved).all()
    result = []
    for r in reviews:
        profile = r.user.profile if r.user else None
        result.append(ReviewOut(
            id=r.id, user_id=r.user_id, university_id=r.university_id,
            rating=r.rating, body=r.body, approved=r.approved, created_at=r.created_at,
            author_name=profile.display_name if profile else "Anonymous"
        ))
    return result


@router.put("/reviews/{review_id}")
async def review_review(
    review_id: str,
    action: str,
    db: Session = Depends(get_db),
    mod=Depends(require_moderator)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404)
    review.approved = (action == "approve")
    db.commit()
    return {"approved": review.approved}


@router.get("/users")
async def list_users(db: Session = Depends(get_db), mod=Depends(require_moderator)):
    users = db.query(User).order_by(User.created_at.desc()).limit(100).all()
    return [{"id": str(u.id), "email": u.email, "role": u.role, "created_at": u.created_at.isoformat()} for u in users]
