from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models.user import User, Profile
from ..schemas.user import ProfileOut, ProfileUpdate, UserOut
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("/{user_id}")
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).options(
        joinedload(User.profile),
        joinedload(User.student_status),
        joinedload(User.exam_scores),
        joinedload(User.applications),
    ).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.profile or not user.profile.is_public:
        raise HTTPException(status_code=403, detail="Profile is private")
    return {
        "id": str(user.id),
        "display_name": user.profile.display_name if user.profile else None,
        "country_origin": user.profile.country_origin if user.profile else None,
        "current_city": user.profile.current_city if user.profile else None,
        "bio": user.profile.bio if user.profile else None,
        "avatar_url": user.profile.avatar_url if user.profile else None,
        "tg_username": user.tg_username,
        "instagram": user.instagram,
        "student_status": [{"university_id": str(s.university_id), "year_of_study": s.year_of_study,
                             "degree_level": s.degree_level, "enrollment_year": s.enrollment_year,
                             "scholarship_received": s.scholarship_received} for s in user.student_status],
        "exam_scores": [{"exam_type": e.exam_type, "score": e.score, "grade": e.grade, "subject": e.subject} for e in user.exam_scores],
    }


@router.put("/me", response_model=ProfileOut)
async def update_profile(body: ProfileUpdate, db: Session = Depends(get_db), me: User = Depends(get_current_user)):
    if not me.profile:
        profile = Profile(user_id=me.id)
        db.add(profile)
        db.flush()
    else:
        profile = me.profile
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile
