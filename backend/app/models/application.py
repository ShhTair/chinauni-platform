import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Text, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id"))
    major_id = Column(UUID(as_uuid=True), ForeignKey("majors.id"), nullable=True)
    major_custom = Column(String, nullable=True)
    scholarship_applied = Column(String, nullable=True)
    status = Column(String, nullable=True)  # applied|interview|offer|rejected|waitlist|withdrawn
    month_applied = Column(String, nullable=True)
    month_interview = Column(String, nullable=True)
    month_offer = Column(String, nullable=True)
    month_scholarship = Column(String, nullable=True)
    date_applied = Column(Date, nullable=True)
    date_interview = Column(Date, nullable=True)
    date_offer = Column(Date, nullable=True)
    date_scholarship = Column(Date, nullable=True)
    dates_are_approximate = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="applications")
    university = relationship("University", back_populates="applications")
    major = relationship("Major")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id"))
    rating = Column(Integer, nullable=False)
    body = Column(Text, nullable=False)
    approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reviews")
    university = relationship("University", back_populates="reviews")


class UserSubmission(Base):
    __tablename__ = "user_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id"))
    field_name = Column(String, nullable=False)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending | approved | rejected
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    moderator_note = Column(Text, nullable=True)

    user = relationship("User", back_populates="submissions")
    university = relationship("University", back_populates="submissions")
