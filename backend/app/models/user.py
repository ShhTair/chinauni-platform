import uuid
from sqlalchemy import Column, String, Boolean, Integer, Float, ForeignKey, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user")  # user | moderator | admin
    email_verified = Column(Boolean, default=False)
    tg_username = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_via = Column(String, nullable=True)  # self_register | intake_form | admin

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    student_status = relationship("StudentStatus", back_populates="user", cascade="all, delete-orphan")
    exam_scores = relationship("ExamScore", back_populates="user", cascade="all, delete-orphan")
    extracurriculars = relationship("Extracurricular", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("UserSubmission", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    display_name = Column(String, nullable=True)
    country_origin = Column(String, nullable=True)
    current_city = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_public = Column(Boolean, default=True)

    user = relationship("User", back_populates="profile")


class StudentStatus(Base):
    __tablename__ = "student_status"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id"), nullable=True)
    major_id = Column(UUID(as_uuid=True), ForeignKey("majors.id"), nullable=True)
    major_custom = Column(String, nullable=True)
    year_of_study = Column(Integer, nullable=True)
    degree_level = Column(String, nullable=True)  # bachelor | master | phd
    enrollment_year = Column(Integer, nullable=True)
    scholarship_received = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)

    user = relationship("User", back_populates="student_status")
    university = relationship("University")
    major = relationship("Major")


class ExamScore(Base):
    __tablename__ = "exam_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    exam_type = Column(String, nullable=False)
    score = Column(Float, nullable=True)
    grade = Column(String, nullable=True)
    subject = Column(String, nullable=True)
    year_taken = Column(Integer, nullable=True)

    user = relationship("User", back_populates="exam_scores")


class Extracurricular(Base):
    __tablename__ = "extracurriculars"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    level = Column(String, nullable=False)  # excellent | high | mid | low
    description = Column(Text, nullable=True)

    user = relationship("User", back_populates="extracurriculars")
