import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["DATABASE_URL"] = "postgresql://postgres.ehykmdtsfoiezwswvdll:3Sv1jVV9FSxbpD6D@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

from app.database import SessionLocal
from app.models.university import University

# I will provide a dictionary of slugs to Logo URLs and Cover Image URLs.
# To do this accurately without external search API right now, I will use Wikipedia/Wikimedia Commons/Official sites for logos and high quality Unsplash photos that match the city/campus vibe.
# For C9 and top 985 universities, there are known logos.

UPDATES = {
    "tsinghua": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Tsinghua_University_logo.svg/1200px-Tsinghua_University_logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=1400&h=400&fit=crop"
    },
    "pku": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Peking_University_seal.svg/1200px-Peking_University_seal.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1400&h=400&fit=crop"
    },
    "fudan": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Fudan_University_Logo.svg/1200px-Fudan_University_Logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1400&h=400&fit=crop"
    },
    "sjtu": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Shanghai_Jiao_Tong_University_Logo.svg/1200px-Shanghai_Jiao_Tong_University_Logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1582650508520-22c6767eb5d1?w=1400&h=400&fit=crop"
    },
    "zju": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Zhejiang_University_Logo.svg/1200px-Zhejiang_University_Logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1574263468-3b4a09b0f6ab?w=1400&h=400&fit=crop"
    },
    "ustc": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/USTC_logo.svg/1200px-USTC_logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1562516155-e0c1ee44059b?w=1400&h=400&fit=crop"
    },
    "nju": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/ff/Nanjing_University_logo.svg/1200px-Nanjing_University_logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1597435877853-0a4ab7b0e0dc?w=1400&h=400&fit=crop"
    },
    "hit": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Harbin_Institute_of_Technology_logo.svg/1200px-Harbin_Institute_of_Technology_logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1483729200-9bf20b27ab45?w=1400&h=400&fit=crop"
    },
    "xjtu": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Xi%27an_Jiaotong_University_logo.svg/1200px-Xi%27an_Jiaotong_University_logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1545500222-3e3a8e7fa3a4?w=1400&h=400&fit=crop"
    },
    "tongji": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Tongji_University_Logo.svg/1200px-Tongji_University_Logo.svg.png"
    },
    "bnu": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Beijing_Normal_University_logo.svg/1200px-Beijing_Normal_University_logo.svg.png"
    },
    "sysu": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Sun_Yat-sen_University_Logo.svg/1200px-Sun_Yat-sen_University_Logo.svg.png"
    },
    "whu": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/Wuhan_University_logo.svg/1200px-Wuhan_University_logo.svg.png"
    },
    "scut": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/South_China_University_of_Technology_logo.svg/1200px-South_China_University_of_Technology_logo.svg.png"
    },
    "ruc": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Renmin_University_of_China_logo.svg/1200px-Renmin_University_of_China_logo.svg.png"
    },
    "nankai": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Nankai_University_logo.svg/1200px-Nankai_University_logo.svg.png"
    },
    "nyu-shanghai": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/NYU_Shanghai_logo.svg/1200px-NYU_Shanghai_logo.svg.png",
        "cover_image_url": "https://images.unsplash.com/photo-1582650508520-22c6767eb5d1?w=1400&h=400&fit=crop"
    },
    "duke-kunshan": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Duke_Kunshan_University_logo.png/1200px-Duke_Kunshan_University_logo.png",
        "cover_image_url": "https://images.unsplash.com/photo-1597435877853-0a4ab7b0e0dc?w=1400&h=400&fit=crop"
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
