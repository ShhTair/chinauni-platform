import sys
import os
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["DATABASE_URL"] = "postgresql://postgres.ehykmdtsfoiezwswvdll:3Sv1jVV9FSxbpD6D@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

from app.database import SessionLocal
from app.models.university import University

NEW_UNIVERSITIES = [
    {
        "slug": "sysu", "name": "Sun Yat-sen University", "name_cn": "中山大学",
        "city": "Guangzhou", "province": "Guangdong", "prestige_stars": 4,
        "league": "985", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 267, "the_rank": 251, "intl_pct": 5,
        "ielts_min": 6.0, "app_fee_usd": 60, "tuition_cny_yr": 35000,
        "portal_status": "OPEN", "tier": "TARGET",
        "url_info": "https://www.sysu.edu.cn",
        "url_portal": "https://apply.sysu.edu.cn",
        "coordinates": {"lat": 23.0970, "lng": 113.2982},
        "notes_public": "Top university in Southern China. Great for medical and business studies.",
        "cover_image_url": "https://images.unsplash.com/photo-1574263468-3b4a09b0f6ab?w=1400&h=400&fit=crop&q=80"
    },
    {
        "slug": "whu", "name": "Wuhan University", "name_cn": "武汉大学",
        "city": "Wuhan", "province": "Hubei", "prestige_stars": 4,
        "league": "985", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 194, "the_rank": 157, "intl_pct": 7,
        "ielts_min": 6.0, "app_fee_usd": 100, "tuition_cny_yr": 28000,
        "portal_status": "OPEN", "tier": "TARGET",
        "url_info": "https://www.whu.edu.cn",
        "url_portal": "https://admission.whu.edu.cn",
        "coordinates": {"lat": 30.5365, "lng": 114.3607},
        "notes_public": "Known as one of the most beautiful campuses in China. Strong in sciences and engineering.",
        "cover_image_url": "https://images.unsplash.com/photo-1545500222-3e3a8e7fa3a4?w=1400&h=400&fit=crop&q=80"
    },
    {
        "slug": "scut", "name": "South China University of Technology", "name_cn": "华南理工大学",
        "city": "Guangzhou", "province": "Guangdong", "prestige_stars": 4,
        "league": "985", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 392, "the_rank": 401, "intl_pct": 4,
        "ielts_min": 6.0, "app_fee_usd": 60, "tuition_cny_yr": 26000,
        "portal_status": "OPEN", "tier": "TARGET",
        "url_info": "https://www.scut.edu.cn",
        "url_portal": "https://admission.scut.edu.cn",
        "coordinates": {"lat": 23.1517, "lng": 113.3444},
        "notes_public": "Excellent engineering and technology focus in the Greater Bay Area.",
        "cover_image_url": "https://images.unsplash.com/photo-1562516155-e0c1ee44059b?w=1400&h=400&fit=crop&q=80"
    },
    {
        "slug": "ruc", "name": "Renmin University of China", "name_cn": "中国人民大学",
        "city": "Beijing", "province": "Beijing", "prestige_stars": 5,
        "league": "985", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 500, "the_rank": 400, "intl_pct": 8,
        "ielts_min": 6.5, "app_fee_usd": 100, "tuition_cny_yr": 30000,
        "portal_status": "OPEN", "tier": "REACH",
        "url_info": "https://www.ruc.edu.cn",
        "url_portal": "https://admission.ruc.edu.cn",
        "coordinates": {"lat": 39.9702, "lng": 116.3150},
        "notes_public": "Top university in China for humanities and social sciences.",
        "cover_image_url": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1400&h=400&fit=crop&q=80"
    },
    {
        "slug": "nankai", "name": "Nanjing University", "name_cn": "南京大学",
        "city": "Nanjing", "province": "Jiangsu", "prestige_stars": 5,
        "league": "C9", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 141, "the_rank": 111, "intl_pct": 5,
        "ielts_min": 6.0, "app_fee_usd": 80, "tuition_cny_yr": 28000,
        "portal_status": "OPEN", "tier": "REACH",
        "url_info": "https://www.nju.edu.cn",
        "url_portal": "https://hwxy.nju.edu.cn",
        "coordinates": {"lat": 32.0584, "lng": 118.7965},
        "notes_public": "C9 league university with a rich history and strong academic reputation.",
        "cover_image_url": "https://images.unsplash.com/photo-1597435877853-0a4ab7b0e0dc?w=1400&h=400&fit=crop&q=80"
    },
    {
        "slug": "bnu", "name": "Beijing Normal University", "name_cn": "北京师范大学",
        "city": "Beijing", "province": "Beijing", "prestige_stars": 4,
        "league": "985", "diploma_type": "Chinese", "english_ug": "partial",
        "qs_rank": 272, "the_rank": 300, "intl_pct": 6,
        "ielts_min": 6.0, "app_fee_usd": 80, "tuition_cny_yr": 26000,
        "portal_status": "OPEN", "tier": "TARGET",
        "url_info": "https://www.bnu.edu.cn",
        "url_portal": "https://admission.bnu.edu.cn",
        "coordinates": {"lat": 39.9610, "lng": 116.3660},
        "notes_public": "The best normal (teaching/education) university in China.",
        "cover_image_url": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1400&h=400&fit=crop&q=80"
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
        print(f"Added {count} new universities!")
    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
