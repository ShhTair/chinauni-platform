import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["DATABASE_URL"] = "postgresql://postgres.ehykmdtsfoiezwswvdll:3Sv1jVV9FSxbpD6D@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

from app.database import SessionLocal
from app.models.university import University

UPDATES = {
    "cqu": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Chongqing_University_logo.png/1200px-Chongqing_University_logo.png",
        "cover_image_url": "https://images.unsplash.com/photo-1552597992-06b297bcf52e?w=1400&h=400&fit=crop"
    },
    "szu": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Shenzhen_University_logo.svg/1200px-Shenzhen_University_logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=1400&h=400&fit=crop"
    },
    "uibe": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/0/06/University_of_International_Business_and_Economics_logo.svg/1200px-University_of_International_Business_and_Economics_logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1400&h=400&fit=crop"
    },
    "scnu": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/South_China_Normal_University_logo.svg/1200px-South_China_Normal_University_logo.svg.png"
    },
    "whu": {
        "cover_image_url": "https://images.unsplash.com/photo-1582650508520-22c6767eb5d1?w=1400&h=400&fit=crop"
    }
}

def seed():
    db = SessionLocal()
    try:
        count = 0
        for slug, data in UPDATES.items():
            uni = db.query(University).filter(University.slug == slug).first()
            if uni:
                if "logo_url" in data:
                    uni.logo_url = data["logo_url"]
                if "cover_image_url" in data:
                    uni.cover_image_url = data["cover_image_url"]
                count += 1
        db.commit()
        print(f"Updated {count} universities with logos and images!")
    except Exception as e:
        print("Error:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
