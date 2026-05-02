from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models.application import Application, Review, UserSubmission
from ..models.user import User
from ..schemas.application import ApplicationIn, ApplicationOut, ReviewIn, ReviewOut, SubmissionIn, SubmissionOut
from ..services.auth import get_current_user, get_optional_user

router = APIRouter(tags=["applications"])


# Applications
@router.get("/api/users/{user_id}/applications", response_model=List[ApplicationOut])
async def get_user_applications(user_id: str, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    if str(me.id) != user_id and me.role not in ("moderator", "admin"):
        raise HTTPException(status_code=403)
    return db.query(Application).filter(Application.user_id == user_id).all()


@router.post("/api/applications", response_model=ApplicationOut)
async def create_application(body: ApplicationIn, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    app = Application(user_id=me.id, **body.model_dump())
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.put("/api/applications/{app_id}", response_model=ApplicationOut)
async def update_application(app_id: str, body: ApplicationIn, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404)
    if str(app.user_id) != str(me.id) and me.role not in ("moderator", "admin"):
        raise HTTPException(status_code=403)
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(app, k, v)
    db.commit()
    db.refresh(app)
    return app


# Reviews
@router.get("/api/universities/{slug}/reviews", response_model=List[ReviewOut])
async def get_reviews(slug: str, db: Session = Depends(get_db)):
    from ..models.university import University
    uni = db.query(University).filter(University.slug == slug).first()
    if not uni:
        raise HTTPException(status_code=404)
    reviews = db.query(Review).options(joinedload(Review.user)).filter(
        Review.university_id == uni.id, Review.approved == True
    ).all()
    result = []
    for r in reviews:
        profile = r.user.profile if r.user else None
        result.append(ReviewOut(
            id=r.id, user_id=r.user_id, university_id=r.university_id,
            rating=r.rating, body=r.body, approved=r.approved, created_at=r.created_at,
            author_name=profile.display_name if profile else "Anonymous"
        ))
    return result


@router.post("/api/universities/{slug}/reviews", response_model=ReviewOut)
async def create_review(slug: str, body: ReviewIn, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    from ..models.university import University
    uni = db.query(University).filter(University.slug == slug).first()
    if not uni:
        raise HTTPException(status_code=404)
    review = Review(user_id=me.id, university_id=uni.id, **body.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return ReviewOut(
        id=review.id, user_id=review.user_id, university_id=review.university_id,
        rating=review.rating, body=review.body, approved=review.approved, created_at=review.created_at
    )


# Submissions
@router.post("/api/submissions", response_model=SubmissionOut)
async def create_submission(body: SubmissionIn, db: Session = Depends(get_db), me: User = Depends(get_optional_user)):
    sub = UserSubmission(user_id=me.id if me else None, **body.model_dump())
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub
