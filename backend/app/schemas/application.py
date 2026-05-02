from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date, datetime


class ApplicationIn(BaseModel):
    university_id: UUID
    major_id: Optional[UUID] = None
    major_custom: Optional[str] = None
    scholarship_applied: Optional[str] = None
    status: Optional[str] = None
    month_applied: Optional[str] = None
    month_interview: Optional[str] = None
    month_offer: Optional[str] = None
    month_scholarship: Optional[str] = None
    date_applied: Optional[date] = None
    date_interview: Optional[date] = None
    date_offer: Optional[date] = None
    date_scholarship: Optional[date] = None
    dates_are_approximate: bool = True
    notes: Optional[str] = None
    is_public: bool = True


class ApplicationOut(ApplicationIn):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewIn(BaseModel):
    rating: int
    body: str


class ReviewOut(BaseModel):
    id: UUID
    user_id: UUID
    university_id: UUID
    rating: int
    body: str
    approved: bool
    created_at: datetime
    author_name: Optional[str] = None

    class Config:
        from_attributes = True


class SubmissionIn(BaseModel):
    university_id: UUID
    field_name: str
    old_value: Optional[str] = None
    new_value: str


class SubmissionOut(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    university_id: UUID
    field_name: str
    old_value: Optional[str]
    new_value: Optional[str]
    status: str
    submitted_at: datetime
    moderator_note: Optional[str]

    class Config:
        from_attributes = True
