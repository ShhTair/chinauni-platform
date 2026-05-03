import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["DATABASE_URL"] = "postgresql://postgres.ehykmdtsfoiezwswvdll:3Sv1jVV9FSxbpD6D@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

from app.database import SessionLocal
from app.models.university import University

# Top Chinese Universities according to Shanghai Ranking (ARWU) 
SHANGHAI_RANKINGS = [
    {"name": "Tsinghua University", "shanghai_rank": 22},
    {"name": "Peking University", "shanghai_rank": 29},
    {"name": "Zhejiang University", "shanghai_rank": 33},
    {"name": "Shanghai Jiao Tong University", "shanghai_rank": 46},
    {"name": "Fudan University", "shanghai_rank": 54},
    {"name": "University of Science and Technology of China", "shanghai_rank": 63},
    {"name": "Sun Yat-sen University", "shanghai_rank": 72},
    {"name": "Huazhong University of Science and Technology", "shanghai_rank": 89},
    {"name": "Nanjing University", "shanghai_rank": 94},
    {"name": "Wuhan University", "shanghai_rank": 99},
    {"name": "Central South University", "shanghai_rank": 101},
    {"name": "Xi'an Jiaotong University", "shanghai_rank": 102},
    {"name": "Sichuan University", "shanghai_rank": 103},
    {"name": "Harbin Institute of Technology", "shanghai_rank": 104},
    {"name": "Shandong University", "shanghai_rank": 105},
    {"name": "Beihang University", "shanghai_rank": 106},
    {"name": "Jilin University", "shanghai_rank": 107},
    {"name": "South China University of Technology", "shanghai_rank": 108},
    {"name": "Southeast University", "shanghai_rank": 109},
    {"name": "Tongji University", "shanghai_rank": 110},
    {"name": "University of Electronic Science and Technology of China", "shanghai_rank": 111},
    {"name": "Beijing Normal University", "shanghai_rank": 112},
    {"name": "Tianjin University", "shanghai_rank": 113},
    {"name": "Renmin University of China", "shanghai_rank": 114},
    {"name": "Nankai University", "shanghai_rank": 115}
]

# We also need to add unexisting ones into our DB.
# For simplicity, we will update the existing ones first, and create new minimal entries for the ones we don't have.
def seed():
    db = SessionLocal()
    try:
        updated = 0
        added = 0
        for entry in SHANGHAI_RANKINGS:
            uni = db.query(University).filter(University.name == entry["name"]).first()
            if uni:
                uni.shanghai_rank = entry["shanghai_rank"]
                updated += 1
            else:
                # Create a minimal entry
                slug = entry["name"].lower().replace(" ", "-").replace("'", "")
                db.add(University(
                    slug=slug,
                    name=entry["name"],
                    shanghai_rank=entry["shanghai_rank"],
                    prestige_stars=4,
                    league="985",
                    diploma_type="Chinese",
                    english_ug="partial"
                ))
                added += 1
        db.commit()
        print(f"Updated {updated} existing. Added {added} new universities.")
    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
