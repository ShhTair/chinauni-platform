import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["DATABASE_URL"] = "postgresql://postgres.ehykmdtsfoiezwswvdll:3Sv1jVV9FSxbpD6D@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

from app.database import SessionLocal
from app.models.university import University

NEW_UNIVERSITIES = [
    # --- PROVINCIAL & REGIONAL (Good for scholarships) ---
    {
        "slug": "cqu", "name": "Chongqing University", "name_cn": "重庆大学",
        "city": "Chongqing", "province": "Chongqing", "prestige_stars": 4,
        "league": "985", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 310, "the_rank": 401, "intl_pct": 3,
        "ielts_min": 6.0, "app_fee_usd": 60, "tuition_cny_yr": 22000,
        "portal_status": "OPEN", "tier": "TARGET",
        "url_info": "http://study.cqu.edu.cn",
        "url_portal": "https://cqu.17gz.org/",
        "coordinates": {"lat": 29.5647, "lng": 106.4608},
        "notes_public": "Major comprehensive university in Southwest China. High acceptance rate for CIS students."
    },
    {
        "slug": "neu", "name": "Northeastern University", "name_cn": "东北大学",
        "city": "Shenyang", "province": "Liaoning", "prestige_stars": 4,
        "league": "985", "diploma_type": "Chinese", "english_ug": "no",
        "qs_rank": 501, "the_rank": 601, "intl_pct": 2,
        "ielts_min": 5.5, "app_fee_usd": 80, "tuition_cny_yr": 20000,
        "portal_status": "OPEN", "tier": "LIKELY",
        "url_info": "http://study.neu.edu.cn",
        "coordinates": {"lat": 41.7656, "lng": 123.4180},
        "notes_public": "Great choice for heavy engineering. Generous provincial scholarships available."
    },
    {
        "slug": "dlut", "name": "South China Normal University", "name_cn": "华南师范大学",
        "city": "Guangzhou", "province": "Guangdong", "prestige_stars": 3,
        "league": "211", "diploma_type": "Chinese", "english_ug": "yes",
        "qs_rank": 601, "the_rank": 801, "intl_pct": 4,
        "ielts_min": 6.0, "app_fee_usd": 60, "tuition_cny_yr": 24000,
        "portal_status": "OPEN", "tier": "LIKELY",
        "url_info": "http://english.scnu.edu.cn",
        "coordinates": {"lat": 23.1413, "lng": 113.3496},
        "notes_public": "Very active in enrolling CIS students. Has many English-taught bachelor programs."
    },
    {
        "slug": "swufe", "name": "Southwestern University of Finance and Economics", "name_cn": "西南财经大学",
        "city": "Chengdu", "province": "Sichuan", "prestige_stars": 3,
        "league": "211", "diploma_type": "Chinese", "english_ug": "yes",
        "qs_rank": 501, "the_rank": None, "intl_pct": 5,
        "ielts_min": 6.0, "app_fee_usd": 90, "tuition_cny_yr": 25000,
        "portal_status": "OPEN", "tier": "TARGET",
        "url_info": "http://international.swufe.edu.cn",
        "coordinates": {"lat": 30.6698, "lng": 104.0152},
        "notes_public": "Top specialized university for Finance and Business in Western China. Generous full scholarships."
    },
    {
        "slug": "uibe", "name": "University of International Business and Economics", "name_cn": "对外经济贸易大学",
        "city": "Beijing", "province": "Beijing", "prestige_stars": 4,
        "league": "211", "diploma_type": "Chinese", "english_ug": "yes",
        "qs_rank": None, "the_rank": None, "intl_pct": 18,
        "ielts_min": 6.0, "app_fee_usd": 100, "tuition_cny_yr": 35000,
        "portal_status": "OPEN", "tier": "REACH",
        "url_info": "http://sie.uibe.edu.cn",
        "url_portal": "https://uibe.17gz.org/",
        "coordinates": {"lat": 39.9791, "lng": 116.4258},
        "notes_public": "Huge international community (18%+). Fantastic English-taught business degrees."
    },
    {
        "slug": "shnu", "name": "Shanghai Normal University", "name_cn": "上海师范大学",
        "city": "Shanghai", "province": "Shanghai", "prestige_stars": 3,
        "league": "Private", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": None, "the_rank": 1001, "intl_pct": 4,
        "ielts_min": 5.5, "app_fee_usd": 80, "tuition_cny_yr": 22000,
        "portal_status": "CLOSED", "tier": "LIKELY",
        "url_info": "http://iao.shnu.edu.cn",
        "coordinates": {"lat": 31.1687, "lng": 121.4172},
        "notes_public": "Good backup option in Shanghai. Easier admission criteria."
    },
    {
        "slug": "nwu", "name": "Northwest University", "name_cn": "西北大学",
        "city": "Xi'an", "province": "Shaanxi", "prestige_stars": 3,
        "league": "211", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 701, "the_rank": None, "intl_pct": 3,
        "ielts_min": 5.5, "app_fee_usd": 50, "tuition_cny_yr": 20000,
        "portal_status": "OPEN", "tier": "LIKELY",
        "url_info": "http://tonwu.nwu.edu.cn",
        "coordinates": {"lat": 34.2505, "lng": 108.9248},
        "notes_public": "Affordable city, deep cultural history, often gives full tuition waivers."
    },
    {
        "slug": "szu", "name": "Shenzhen University", "name_cn": "深圳大学",
        "city": "Shenzhen", "province": "Guangdong", "prestige_stars": 4,
        "league": "Private", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 501, "the_rank": 401, "intl_pct": 3,
        "ielts_min": 6.0, "app_fee_usd": 30, "tuition_cny_yr": 26000,
        "portal_status": "OPEN", "tier": "TARGET",
        "url_info": "http://lxs.szu.edu.cn",
        "coordinates": {"lat": 22.5350, "lng": 113.9317},
        "notes_public": "Very modern campus. Excellent ties with tech companies like Tencent and Huawei."
    }
]

def seed():
    db = SessionLocal()
    try:
        count = 0
        for uni_data in NEW_UNIVERSITIES:
            existing = db.query(University).filter(University.slug == uni_data["slug"]).first()
            if not existing:
                db.add(University(**uni_data))
                count += 1
        db.commit()
        print(f"Added {count} additional regional & targeted universities!")
    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
