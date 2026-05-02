from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: UUID
    email: str
    role: str
    email_verified: bool
    tg_username: Optional[str]
    instagram: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ProfileOut(BaseModel):
    id: UUID
    user_id: UUID
    display_name: Optional[str]
    country_origin: Optional[str]
    current_city: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    is_public: bool

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    country_origin: Optional[str] = None
    current_city: Optional[str] = None
    bio: Optional[str] = None
    is_public: Optional[bool] = None


class ExamScoreIn(BaseModel):
    exam_type: str
    score: Optional[float] = None
    grade: Optional[str] = None
    subject: Optional[str] = None
    year_taken: Optional[int] = None


class ExamScoreOut(ExamScoreIn):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True


class StudentStatusIn(BaseModel):
    university_id: Optional[UUID] = None
    major_id: Optional[UUID] = None
    major_custom: Optional[str] = None
    year_of_study: Optional[int] = None
    degree_level: Optional[str] = None
    enrollment_year: Optional[int] = None
    scholarship_received: Optional[str] = None


class StudentStatusOut(StudentStatusIn):
    id: UUID
    user_id: UUID
    is_verified: bool

    class Config:
        from_attributes = True


class IntakeFormSubmit(BaseModel):
    # Step 1: University info
    university_id: Optional[UUID] = None
    university_slug: Optional[str] = None
    major_id: Optional[UUID] = None
    major_custom: Optional[str] = None
    year_of_study: Optional[int] = None
    enrollment_year: Optional[int] = None
    degree_level: Optional[str] = "bachelor"
    scholarship_received: Optional[str] = None
    # Step 2: Exam scores
    exam_scores: Optional[List[ExamScoreIn]] = None
    # Step 3: Extracurriculars + Application timeline
    extracurricular_level: Optional[str] = None
    extracurricular_description: Optional[str] = None
    application_status: Optional[str] = None
    scholarship_applied: Optional[str] = None
    month_applied: Optional[str] = None
    month_interview: Optional[str] = None
    month_offer: Optional[str] = None
    month_scholarship: Optional[str] = None
    # Step 4: Account
    email: EmailStr
    tg_username: Optional[str] = None
    instagram: Optional[str] = None
    is_public: bool = True
    agreed: bool = True


class IntakeFormResult(BaseModel):
    account_created: bool
    email: str
    temp_password: Optional[str] = None
    profile_url: str
    message: str
