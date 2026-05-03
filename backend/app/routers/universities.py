from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_
from typing import Optional, List
from ..database import get_db
from ..models.university import University, Major, Scholarship, Deadline
from ..models.user import User
from ..schemas.university import (
    UniversityListItem, UniversityListItemAuth, UniversityDetail,
    UniversityIn, UniversityMapItem, MajorOut, MajorIn,
    ScholarshipOut, ScholarshipIn, DeadlineOut, DeadlineIn
)
from ..services.auth import get_optional_user, get_current_user, require_moderator
from ..middleware.rate_limit import limiter

router = APIRouter(prefix="/api/universities", tags=["universities"])


@router.get("", response_model=dict)
@limiter.limit("60/minute")
async def list_universities(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
    province: Optional[str] = None,
    league: Optional[str] = None,
    english_ug: Optional[str] = None,
    prestige_min: Optional[int] = None,
    prestige_max: Optional[int] = None,
    has_scholarship: Optional[bool] = None,
    field: Optional[str] = None,
    diploma_type: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "prestige_desc",
    page: int = 1,
    limit: int = 20,
):
    query = db.query(University)

    if province:
        query = query.filter(University.province == province)
    if league:
        leagues = [l.strip() for l in league.split(",")]
        query = query.filter(University.league.in_(leagues))
    if english_ug:
        query = query.filter(University.english_ug == english_ug)
    if prestige_min is not None:
        query = query.filter(University.prestige_stars >= prestige_min)
    if prestige_max is not None:
        query = query.filter(University.prestige_stars <= prestige_max)
    if diploma_type:
        types = [t.strip() for t in diploma_type.split(",")]
        query = query.filter(University.diploma_type.in_(types))
    if search:
        query = query.filter(
            or_(
                University.name.ilike(f"%{search}%"),
                University.name_cn.ilike(f"%{search}%"),
                University.city.ilike(f"%{search}%"),
            )
        )

    if sort == "prestige_desc":
        query = query.order_by(University.prestige_stars.desc().nulls_last())
    elif sort == "prestige_asc":
        query = query.order_by(University.prestige_stars.asc().nulls_last())
    elif sort == "qs_rank_asc":
        query = query.order_by(University.qs_rank.asc().nulls_last())
    elif sort == "province_asc":
        query = query.order_by(University.province.asc())

    total = query.count()
    universities = query.offset((page - 1) * limit).limit(limit).all()

    if current_user:
        items = [UniversityListItemAuth.model_validate(u) for u in universities]
    else:
        items = [UniversityListItem.model_validate(u) for u in universities]

    return {
        "items": [i.model_dump() for i in items],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
        "authenticated": current_user is not None,
    }


@router.get("/map", response_model=List[UniversityMapItem])
async def universities_map(
    db: Session = Depends(get_db),
    province: Optional[str] = None,
    league: Optional[str] = None,
    english_ug: Optional[str] = None,
    prestige_min: Optional[int] = None,
    prestige_max: Optional[int] = None,
    diploma_type: Optional[str] = None,
    search: Optional[str] = None,
):
    query = db.query(University).filter(University.coordinates.isnot(None))

    if province:
        provs = [p.strip() for p in province.split(",")]
        query = query.filter(University.province.in_(provs))
    if league:
        leagues = [l.strip() for l in league.split(",")]
        query = query.filter(University.league.in_(leagues))
    if english_ug:
        query = query.filter(University.english_ug == english_ug)
    if prestige_min is not None:
        query = query.filter(University.prestige_stars >= prestige_min)
    if prestige_max is not None:
        query = query.filter(University.prestige_stars <= prestige_max)
    if diploma_type:
        dips = [d.strip() for d in diploma_type.split(",")]
        query = query.filter(University.diploma_type.in_(dips))
    if search:
        query = query.filter(
            or_(
                University.name.ilike(f"%{search}%"),
                University.name_cn.ilike(f"%{search}%"),
                University.slug.ilike(f"%{search}%"),
                University.city.ilike(f"%{search}%"),
            )
        )

    return query.all()


@router.get("/{slug}", response_model=UniversityDetail)
@limiter.limit("120/minute")
async def get_university(
    request: Request,
    slug: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    uni = db.query(University).options(
        joinedload(University.majors),
        joinedload(University.scholarships),
        joinedload(University.deadlines),
    ).filter(University.slug == slug).first()
    if not uni:
        raise HTTPException(status_code=404, detail="University not found")
    return uni


@router.post("", response_model=UniversityDetail)
async def create_university(body: UniversityIn, db: Session = Depends(get_db), mod=Depends(require_moderator)):
    uni = University(**body.model_dump())
    db.add(uni)
    db.commit()
    db.refresh(uni)
    return uni


@router.put("/{id}", response_model=UniversityDetail)
async def update_university(id: str, body: UniversityIn, db: Session = Depends(get_db), mod=Depends(require_moderator)):
    uni = db.query(University).filter(University.id == id).first()
    if not uni:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(uni, k, v)
    db.commit()
    db.refresh(uni)
    return uni


# Majors
@router.get("/{slug}/majors", response_model=List[MajorOut])
async def get_majors(slug: str, db: Session = Depends(get_db)):
    uni = db.query(University).filter(University.slug == slug).first()
    if not uni:
        raise HTTPException(status_code=404)
    return uni.majors


@router.post("/{slug}/majors", response_model=MajorOut)
async def create_major(slug: str, body: MajorIn, db: Session = Depends(get_db), mod=Depends(require_moderator)):
    uni = db.query(University).filter(University.slug == slug).first()
    if not uni:
        raise HTTPException(status_code=404)
    major = Major(university_id=uni.id, **body.model_dump())
    db.add(major)
    db.commit()
    db.refresh(major)
    return major


# Scholarships
@router.get("/{slug}/scholarships", response_model=List[ScholarshipOut])
async def get_scholarships(slug: str, db: Session = Depends(get_db)):
    uni = db.query(University).filter(University.slug == slug).first()
    if not uni:
        raise HTTPException(status_code=404)
    return uni.scholarships


# Deadlines
@router.get("/{slug}/deadlines", response_model=List[DeadlineOut])
async def get_deadlines(slug: str, db: Session = Depends(get_db)):
    uni = db.query(University).filter(University.slug == slug).first()
    if not uni:
        raise HTTPException(status_code=404)
    return uni.deadlines
