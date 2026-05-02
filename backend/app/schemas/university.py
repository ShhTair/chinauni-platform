from pydantic import BaseModel
from typing import Optional, List, Any
from uuid import UUID
from datetime import date


class MajorOut(BaseModel):
    id: UUID
    university_id: UUID
    major_name: str
    field: Optional[str]
    department: Optional[str]
    school_name: Optional[str]
    url_major_page: Optional[str]
    language: Optional[str]
    duration: Optional[str]
    tuition_override_cny: Optional[int]
    ielts_override: Optional[float]
    notes: Optional[str]

    class Config:
        from_attributes = True


class MajorIn(BaseModel):
    major_name: str
    field: Optional[str] = None
    department: Optional[str] = None
    school_name: Optional[str] = None
    url_major_page: Optional[str] = None
    language: Optional[str] = None
    duration: Optional[str] = None
    tuition_override_cny: Optional[int] = None
    ielts_override: Optional[float] = None
    notes: Optional[str] = None


class ScholarshipOut(BaseModel):
    id: UUID
    university_id: Optional[UUID]
    name: str
    type: Optional[str]
    coverage: Optional[str]
    amount_cny_yr: Optional[int]
    coverage_pct: Optional[int]
    conditions: Optional[str]
    deadline: Optional[date]
    url: Optional[str]
    renewable: bool
    notes: Optional[str]

    class Config:
        from_attributes = True


class ScholarshipIn(BaseModel):
    university_id: Optional[UUID] = None
    name: str
    type: Optional[str] = None
    coverage: Optional[str] = None
    amount_cny_yr: Optional[int] = None
    coverage_pct: Optional[int] = None
    conditions: Optional[str] = None
    deadline: Optional[date] = None
    url: Optional[str] = None
    renewable: bool = True
    notes: Optional[str] = None


class DeadlineOut(BaseModel):
    id: UUID
    university_id: UUID
    round_label: Optional[str]
    deadline_date: Optional[date]
    result_date: Optional[date]
    scholarship_eligible: bool
    notes: Optional[str]

    class Config:
        from_attributes = True


class DeadlineIn(BaseModel):
    round_label: Optional[str] = None
    deadline_date: Optional[date] = None
    result_date: Optional[date] = None
    scholarship_eligible: bool = True
    notes: Optional[str] = None


class UniversityListItem(BaseModel):
    id: UUID
    slug: str
    name: str
    name_cn: Optional[str]
    city: Optional[str]
    province: Optional[str]
    prestige_stars: Optional[int]
    league: Optional[str]
    diploma_type: Optional[str]
    english_ug: Optional[str]
    qs_rank: Optional[int]
    ielts_min: Optional[float]
    app_fee_usd: Optional[int]
    tuition_cny_yr: Optional[int]
    portal_status: Optional[str]
    tier: Optional[str]
    cover_image_url: Optional[str]
    logo_url: Optional[str]
    coordinates: Optional[Any]

    class Config:
        from_attributes = True


class UniversityListItemAuth(UniversityListItem):
    """Full data for authenticated users"""
    url_info: Optional[str]
    url_portal: Optional[str]
    url_majors: Optional[str]
    url_deadlines: Optional[str]
    url_scholarships: Optional[str]
    the_rank: Optional[int]
    intl_pct: Optional[int]
    notes_public: Optional[str]
    google_maps_url: Optional[str]
    gallery_urls: Optional[Any]

    class Config:
        from_attributes = True


class UniversityDetail(UniversityListItemAuth):
    majors: List[MajorOut] = []
    scholarships: List[ScholarshipOut] = []
    deadlines: List[DeadlineOut] = []

    class Config:
        from_attributes = True


class UniversityIn(BaseModel):
    slug: str
    name: str
    name_cn: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    prestige_stars: Optional[int] = None
    league: Optional[str] = None
    diploma_type: Optional[str] = None
    english_ug: Optional[str] = None
    qs_rank: Optional[int] = None
    the_rank: Optional[int] = None
    intl_pct: Optional[int] = None
    url_info: Optional[str] = None
    url_portal: Optional[str] = None
    url_majors: Optional[str] = None
    url_deadlines: Optional[str] = None
    url_scholarships: Optional[str] = None
    ielts_min: Optional[float] = None
    app_fee_usd: Optional[int] = None
    tuition_cny_yr: Optional[int] = None
    portal_status: Optional[str] = None
    tier: Optional[str] = None
    notes_public: Optional[str] = None
    notes_private: Optional[str] = None
    cover_image_url: Optional[str] = None
    logo_url: Optional[str] = None
    gallery_urls: Optional[List[str]] = None
    google_maps_url: Optional[str] = None
    coordinates: Optional[Any] = None


class UniversityMapItem(BaseModel):
    id: UUID
    slug: str
    name: str
    city: Optional[str]
    province: Optional[str]
    prestige_stars: Optional[int]
    league: Optional[str]
    coordinates: Optional[Any]
    logo_url: Optional[str]

    class Config:
        from_attributes = True
