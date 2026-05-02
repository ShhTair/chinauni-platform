import secrets
import string
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, Profile, StudentStatus, ExamScore, Extracurricular
from ..models.university import University
from ..models.application import Application
from ..schemas.user import IntakeFormSubmit, IntakeFormResult
from ..services.auth import hash_password, create_access_token
from ..services.email import send_welcome_email
from ..middleware.rate_limit import limiter

router = APIRouter(prefix="/api/intake", tags=["intake"])


def gen_password(length=10) -> str:
    chars = string.ascii_letters + string.digits + "!@#$"
    return "".join(secrets.choice(chars) for _ in range(length))


@router.post("/{university_slug}", response_model=IntakeFormResult)
@limiter.limit("5/minute")
async def submit_intake(
    request: Request,
    university_slug: str,
    body: IntakeFormSubmit,
    db: Session = Depends(get_db),
):
    # Find or create user
    existing_user = db.query(User).filter(User.email == body.email).first()
    account_created = False
    temp_password = None

    if existing_user:
        user = existing_user
    else:
        temp_password = gen_password()
        user = User(
            email=body.email,
            password_hash=hash_password(temp_password),
            tg_username=body.tg_username,
            instagram=body.instagram,
            created_via="intake_form",
        )
        db.add(user)
        db.flush()
        profile = Profile(user_id=user.id, is_public=body.is_public)
        db.add(profile)
        account_created = True

    # Find university
    uni = db.query(University).filter(University.slug == university_slug).first()
    if not uni and body.university_id:
        uni = db.query(University).filter(University.id == body.university_id).first()

    # Student status
    if uni:
        status_obj = StudentStatus(
            user_id=user.id,
            university_id=uni.id,
            major_id=body.major_id,
            major_custom=body.major_custom,
            year_of_study=body.year_of_study,
            degree_level=body.degree_level,
            enrollment_year=body.enrollment_year,
            scholarship_received=body.scholarship_received,
        )
        db.add(status_obj)

    # Exam scores
    if body.exam_scores:
        for score_data in body.exam_scores:
            score = ExamScore(user_id=user.id, **score_data.model_dump())
            db.add(score)

    # Extracurriculars
    if body.extracurricular_level:
        ec = Extracurricular(
            user_id=user.id,
            level=body.extracurricular_level,
            description=body.extracurricular_description,
        )
        db.add(ec)

    # Application record
    if uni and body.application_status:
        app = Application(
            user_id=user.id,
            university_id=uni.id,
            major_id=body.major_id,
            major_custom=body.major_custom,
            scholarship_applied=body.scholarship_applied,
            status=body.application_status,
            month_applied=body.month_applied,
            month_interview=body.month_interview,
            month_offer=body.month_offer,
            month_scholarship=body.month_scholarship,
        )
        db.add(app)

    db.commit()

    # Send welcome email
    if account_created and temp_password:
        await send_welcome_email(body.email, temp_password)

    return IntakeFormResult(
        account_created=account_created,
        email=body.email,
        temp_password=temp_password,
        profile_url=f"/profile/{str(user.id)}",
        message="Аккаунт создан! Проверьте email для получения пароля." if account_created else "Данные добавлены в ваш профиль.",
    )
