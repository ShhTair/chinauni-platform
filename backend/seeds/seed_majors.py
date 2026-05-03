import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["DATABASE_URL"] = "postgresql://postgres.ehykmdtsfoiezwswvdll:3Sv1jVV9FSxbpD6D@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

from app.database import SessionLocal
from app.models.university import University, Major

MAJORS = [
    # Duke Kunshan
    {"uni_slug": "duke-kunshan", "major_name": "Data Science", "field": "Data Science", "department": "Undergraduate Studies", "language": "English", "duration": "4 years", "url_major_page": "https://dukekunshan.edu.cn/en/undergraduate/data-science"},
    {"uni_slug": "duke-kunshan", "major_name": "Political Economy", "field": "Economics", "department": "Undergraduate Studies", "language": "English", "duration": "4 years", "url_major_page": "https://dukekunshan.edu.cn/en/undergraduate/political-economy"},
    # NYU Shanghai
    {"uni_slug": "nyu-shanghai", "major_name": "Business and Finance", "field": "Business", "department": "Business", "language": "English", "duration": "4 years", "url_major_page": "https://shanghai.nyu.edu/academics/majors/business-and-finance"},
    {"uni_slug": "nyu-shanghai", "major_name": "Computer Science", "field": "CS", "department": "Computer Science", "language": "English", "duration": "4 years", "url_major_page": "https://shanghai.nyu.edu/academics/majors/computer-science"},
    # SJTU
    {"uni_slug": "sjtu", "major_name": "Mechanical Engineering", "field": "Engineering", "department": "UM-SJTU Joint Institute", "language": "English", "duration": "4 years", "url_major_page": "https://ji.sjtu.edu.cn/"},
    {"uni_slug": "sjtu", "major_name": "Artificial Intelligence", "field": "AI", "department": "School of Electronic Information", "language": "Bilingual", "duration": "4 years", "url_major_page": "https://english.seiee.sjtu.edu.cn/"},
    # UIBE
    {"uni_slug": "uibe", "major_name": "International Economics and Trade", "field": "Economics", "department": "School of International Trade", "language": "English", "duration": "4 years", "url_major_page": "http://sie.uibe.edu.cn/en/academics/degree/index.htm"},
    {"uni_slug": "uibe", "major_name": "Business Administration", "field": "Business", "department": "Business School", "language": "English", "duration": "4 years", "url_major_page": "http://sie.uibe.edu.cn/en/academics/degree/index.htm"},
    # ZJU
    {"uni_slug": "zju", "major_name": "Clinical Medicine (MBBS)", "field": "Medicine", "department": "School of Medicine", "language": "English", "duration": "6 years", "url_major_page": "http://iczu.zju.edu.cn/english/2018/1206/c37322a1068800/page.htm"},
    # THU
    {"uni_slug": "thu", "major_name": "Computer Science", "field": "CS", "department": "Department of Computer Science", "language": "Bilingual", "duration": "4 years", "url_major_page": "https://www.cs.tsinghua.edu.cn/"},
]

def seed():
    db = SessionLocal()
    try:
        count = 0
        for m in MAJORS:
            uni = db.query(University).filter(University.slug == m["uni_slug"]).first()
            if not uni:
                continue
            
            existing = db.query(Major).filter(Major.university_id == uni.id, Major.major_name == m["major_name"]).first()
            if not existing:
                db.add(Major(
                    university_id=uni.id,
                    major_name=m["major_name"],
                    field=m["field"],
                    department=m["department"],
                    language=m["language"],
                    duration=m["duration"],
                    url_major_page=m["url_major_page"]
                ))
                count += 1
        db.commit()
        print(f"Added {count} new real majors!")
    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
