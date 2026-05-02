import uuid
from sqlalchemy import Column, String, Boolean, Integer, Float, ForeignKey, Text, Date
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from ..database import Base


class University(Base):
    __tablename__ = "universities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    name_cn = Column(String, nullable=True)
    city = Column(String, nullable=True)
    province = Column(String, nullable=True)
    prestige_stars = Column(Integer, nullable=True)
    league = Column(String, nullable=True)  # C9 | 985 | 211 | HK-Affiliated | US-Affiliated | UK-Affiliated | Private
    diploma_type = Column(String, nullable=True)  # Chinese | US | UK | HK | Dual
    english_ug = Column(String, nullable=True)  # yes | partial | no
    qs_rank = Column(Integer, nullable=True)
    the_rank = Column(Integer, nullable=True)
    intl_pct = Column(Integer, nullable=True)
    url_info = Column(String, nullable=True)
    url_portal = Column(String, nullable=True)
    url_majors = Column(String, nullable=True)
    url_deadlines = Column(String, nullable=True)
    url_scholarships = Column(String, nullable=True)
    ielts_min = Column(Float, nullable=True)
    app_fee_usd = Column(Integer, nullable=True)
    tuition_cny_yr = Column(Integer, nullable=True)
    portal_status = Column(String, nullable=True)  # OPEN | CLOSED
    tier = Column(String, nullable=True)  # REACH | TARGET | LIKELY
    notes_public = Column(Text, nullable=True)
    notes_private = Column(Text, nullable=True)
    cover_image_url = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    gallery_urls = Column(JSON, nullable=True)
    google_maps_url = Column(String, nullable=True)
    coordinates = Column(JSON, nullable=True)
    last_checked = Column(Date, nullable=True)

    majors = relationship("Major", back_populates="university", cascade="all, delete-orphan")
    scholarships = relationship("Scholarship", back_populates="university", cascade="all, delete-orphan")
    deadlines = relationship("Deadline", back_populates="university", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="university")
    applications = relationship("Application", back_populates="university")
    submissions = relationship("UserSubmission", back_populates="university")


class Major(Base):
    __tablename__ = "majors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id"))
    major_name = Column(String, nullable=False)
    field = Column(String, nullable=True)
    department = Column(String, nullable=True)
    school_name = Column(String, nullable=True)
    url_major_page = Column(String, nullable=True)
    language = Column(String, nullable=True)  # English | Chinese | Bilingual
    duration = Column(String, nullable=True)
    tuition_override_cny = Column(Integer, nullable=True)
    ielts_override = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)

    university = relationship("University", back_populates="majors")


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id"), nullable=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=True)  # full | partial | tuition_only | national | provincial
    coverage = Column(String, nullable=True)
    amount_cny_yr = Column(Integer, nullable=True)
    coverage_pct = Column(Integer, nullable=True)
    conditions = Column(Text, nullable=True)
    deadline = Column(Date, nullable=True)
    url = Column(String, nullable=True)
    renewable = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)

    university = relationship("University", back_populates="scholarships")


class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id"))
    round_label = Column(String, nullable=True)  # R1 | R2 | R3 | Rolling | Final
    deadline_date = Column(Date, nullable=True)
    result_date = Column(Date, nullable=True)
    scholarship_eligible = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)

    university = relationship("University", back_populates="deadlines")
