"""
Update universities with logo_url and cover_image_url.
Run: python3 -m seeds.update_images  (from backend/ with DATABASE_URL set)
"""
import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres.ehykmdtsfoiezwswvdll:3Sv1jVV9FSxbpD6D@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
)

# Unsplash cover images – stable photo IDs grouped by city/region
# Format: https://images.unsplash.com/photo-{ID}?w=1400&h=400&fit=crop&q=80
COVERS = {
    # Beijing
    "beijing": "photo-1508804185872-d7badad00f7d",
    # Shanghai
    "shanghai": "photo-1474181487882-5abf3f0ba6c2",
    # Wuhan
    "wuhan": "photo-1589519160732-576fc6634a4c",
    # Guangzhou / Shenzhen (Pearl River Delta)
    "guangdong": "photo-1566733971890-f8deb40f7957",
    # Xi'an / Northwest
    "xian": "photo-1545500222-3e3a8e7fa3a4",
    # Nanjing / Jiangsu
    "nanjing": "photo-1597435877853-0a4ab7b0e0dc",
    # Hangzhou / Zhejiang
    "hangzhou": "photo-1574263468-3b4a09b0f6ab",
    # Chengdu / Sichuan
    "chengdu": "photo-1536700249373-6e5e55d1a1e9",
    # Harbin / Northeast
    "harbin": "photo-1483729200-9bf20b27ab45",
    # Suzhou (XJTLU)
    "suzhou": "photo-1591094389881-e9d39b9c4f8c",
    # Ningbo
    "ningbo": "photo-1523905616563-f2ab6a63a07d",
    # Changsha
    "changsha": "photo-1470770903676-69b98201ea1c",
    # Kunshan (Duke)
    "kunshan": "photo-1474181487882-5abf3f0ba6c2",
    # Generic campus fallback
    "campus": "photo-1562516155-e0c1ee44059b",
}

def cover(city_key: str) -> str:
    pid = COVERS.get(city_key, COVERS["campus"])
    return f"https://images.unsplash.com/{pid}?w=1400&h=400&fit=crop&q=80"

# Wikipedia Commons logos (only where filename is known-correct)
# Format: https://upload.wikimedia.org/wikipedia/en/thumb/{a}/{ab}/{File}/{size}px-{File}
WP = "https://upload.wikimedia.org/wikipedia"

IMAGES: dict[str, dict] = {
    # ── C9 League ────────────────────────────────────────────────────────────
    "thu": {
        "logo_url": f"{WP}/en/thumb/2/22/Tsinghua_University_new_Logo.svg/200px-Tsinghua_University_new_Logo.svg.png",
        "cover_image_url": cover("beijing"),
    },
    "pku": {
        "logo_url": f"{WP}/commons/thumb/7/7c/Peking_University_seal.svg/200px-Peking_University_seal.svg.png",
        "cover_image_url": cover("beijing"),
    },
    "sjtu": {
        "logo_url": f"{WP}/en/thumb/4/4a/Shanghai_Jiao_Tong_University_logo.svg/200px-Shanghai_Jiao_Tong_University_logo.svg.png",
        "cover_image_url": cover("shanghai"),
    },
    "fudan": {
        "logo_url": f"{WP}/commons/thumb/7/72/Fudan_University_Logo.svg/200px-Fudan_University_Logo.svg.png",
        "cover_image_url": cover("shanghai"),
    },
    "zju": {
        "logo_url": f"{WP}/en/thumb/c/cf/Zhejiang_University_Logo.svg/200px-Zhejiang_University_Logo.svg.png",
        "cover_image_url": cover("hangzhou"),
    },
    "ustc": {
        "logo_url": f"{WP}/en/thumb/e/ef/USTC_logo.svg/200px-USTC_logo.svg.png",
        "cover_image_url": cover("campus"),
    },
    "nju": {
        "logo_url": f"{WP}/en/thumb/4/41/Nanjing_University_logo.svg/200px-Nanjing_University_logo.svg.png",
        "cover_image_url": cover("nanjing"),
    },
    "hit": {
        "logo_url": f"{WP}/en/thumb/4/48/HIT_Logo.svg/200px-HIT_Logo.svg.png",
        "cover_image_url": cover("harbin"),
    },
    "xjtu": {
        "logo_url": f"{WP}/commons/thumb/3/3b/Xi%27an_Jiaotong_University_logo.svg/200px-Xi%27an_Jiaotong_University_logo.svg.png",
        "cover_image_url": cover("xian"),
    },
    # ── 985 ──────────────────────────────────────────────────────────────────
    "tongji": {
        "logo_url": f"{WP}/en/thumb/a/af/Tongji_University_Logo.svg/200px-Tongji_University_Logo.svg.png",
        "cover_image_url": cover("shanghai"),
    },
    "sysu": {
        "logo_url": f"{WP}/en/thumb/3/31/Sun_Yat-sen_University_Logo.svg/200px-Sun_Yat-sen_University_Logo.svg.png",
        "cover_image_url": cover("guangdong"),
    },
    "whu": {
        "logo_url": f"{WP}/en/thumb/7/73/Wuhan_University_Logo.svg/200px-Wuhan_University_Logo.svg.png",
        "cover_image_url": cover("wuhan"),
    },
    "hust": {
        "logo_url": f"{WP}/en/thumb/1/12/HUST_logo.svg/200px-HUST_logo.svg.png",
        "cover_image_url": cover("wuhan"),
    },
    "bnu": {
        "logo_url": f"{WP}/en/thumb/8/8a/Beijing_Normal_University_Logo.svg/200px-Beijing_Normal_University_Logo.svg.png",
        "cover_image_url": cover("beijing"),
    },
    "ruc": {
        "logo_url": f"{WP}/en/thumb/e/e9/Renmin_University_of_China_logo.svg/200px-Renmin_University_of_China_logo.svg.png",
        "cover_image_url": cover("beijing"),
    },
    "scut": {
        "logo_url": f"{WP}/en/thumb/d/dd/South_China_University_of_Technology_logo.svg/200px-South_China_University_of_Technology_logo.svg.png",
        "cover_image_url": cover("guangdong"),
    },
    "xmu": {
        "logo_url": f"{WP}/en/thumb/6/63/Xiamen_University_Logo.svg/200px-Xiamen_University_Logo.svg.png",
        "cover_image_url": cover("campus"),
    },
    "buaa": {
        "logo_url": f"{WP}/en/thumb/3/37/Beihang_University_logo.svg/200px-Beihang_University_logo.svg.png",
        "cover_image_url": cover("beijing"),
    },
    "bit": {
        "logo_url": f"{WP}/en/thumb/2/2c/Beijing_Institute_of_Technology_logo.svg/200px-Beijing_Institute_of_Technology_logo.svg.png",
        "cover_image_url": cover("beijing"),
    },
    "jlu": {
        "logo_url": f"{WP}/en/thumb/b/b8/Jilin_University_logo.svg/200px-Jilin_University_logo.svg.png",
        "cover_image_url": cover("campus"),
    },
    "sdu": {
        "logo_url": f"{WP}/en/thumb/e/e1/Shandong_University_logo.svg/200px-Shandong_University_logo.svg.png",
        "cover_image_url": cover("campus"),
    },
    "csu": {
        "logo_url": f"{WP}/en/thumb/1/1d/Central_South_University_logo.svg/200px-Central_South_University_logo.svg.png",
        "cover_image_url": cover("changsha"),
    },
    "seu": {
        "logo_url": f"{WP}/en/thumb/1/1a/Southeast_University_logo.svg/200px-Southeast_University_logo.svg.png",
        "cover_image_url": cover("nanjing"),
    },
    "dlut": {
        "logo_url": f"{WP}/en/thumb/9/9c/Dalian_University_of_Technology_logo.svg/200px-Dalian_University_of_Technology_logo.svg.png",
        "cover_image_url": cover("campus"),
    },
    "nudt": {
        "cover_image_url": cover("changsha"),
    },
    "hnu": {
        "cover_image_url": cover("changsha"),
    },
    "nwpu": {
        "cover_image_url": cover("xian"),
    },
    "cqu": {
        "cover_image_url": cover("chengdu"),
    },
    "sxu": {
        "cover_image_url": cover("chengdu"),
    },
    "ecnu": {
        "cover_image_url": cover("shanghai"),
    },
    "bjtu": {
        "cover_image_url": cover("beijing"),
    },
    "lzu": {
        "cover_image_url": cover("campus"),
    },
    # ── HK / Affiliated ──────────────────────────────────────────────────────
    "hkust-gz": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/HKUST_Logo.svg/200px-HKUST_Logo.svg.png",
        "cover_image_url": cover("guangdong"),
    },
    "cuhk-sz": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/en/4/42/CUHK%28SZ%29_Logo.png",
        "cover_image_url": cover("guangdong"),
    },
    "hku-sz": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/University_of_Hong_Kong_coat_of_arms.svg/200px-University_of_Hong_Kong_coat_of_arms.svg.png",
        "cover_image_url": cover("guangdong"),
    },
    # ── US / UK Affiliated ───────────────────────────────────────────────────
    "nyu-shanghai": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/New_York_University_Logo.svg/200px-New_York_University_Logo.svg.png",
        "cover_image_url": cover("shanghai"),
    },
    "duke-kunshan": {
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Duke_University_logo.svg/200px-Duke_University_logo.svg.png",
        "cover_image_url": cover("kunshan"),
    },
    "xjtlu": {
        "logo_url": f"{WP}/en/thumb/e/e3/Xi%27an_Jiaotong-Liverpool_University_Logo.svg/200px-Xi%27an_Jiaotong-Liverpool_University_Logo.svg.png",
        "cover_image_url": cover("suzhou"),
    },
    "unnc": {
        "logo_url": f"{WP}/commons/thumb/d/d7/University_of_Nottingham_coat_of_arms.svg/200px-University_of_Nottingham_coat_of_arms.svg.png",
        "cover_image_url": cover("ningbo"),
    },
    "wenzhou-kean": {
        "cover_image_url": cover("campus"),
    },
    # ── 211 etc ──────────────────────────────────────────────────────────────
    "swufe": {"cover_image_url": cover("chengdu")},
    "cueb": {"cover_image_url": cover("beijing")},
    "uibe": {"cover_image_url": cover("beijing")},
    "bfsu": {"cover_image_url": cover("beijing")},
    "cupl": {"cover_image_url": cover("beijing")},
    "scnu": {"cover_image_url": cover("guangdong")},
    "nenu": {"cover_image_url": cover("campus")},
    "nwu": {"cover_image_url": cover("xian")},
    "hfut": {"cover_image_url": cover("campus")},
    "heu": {"cover_image_url": cover("harbin")},
    "nust": {"cover_image_url": cover("nanjing")},
    "nuaa": {"cover_image_url": cover("nanjing")},
    "swu": {"cover_image_url": cover("chengdu")},
    "whut": {"cover_image_url": cover("wuhan")},
    "swjtu": {"cover_image_url": cover("chengdu")},
    "gzu": {"cover_image_url": cover("campus")},
    "tyut": {"cover_image_url": cover("campus")},
    "ncu": {"cover_image_url": cover("campus")},
    "shnu": {"cover_image_url": cover("shanghai")},
    "ynu": {"cover_image_url": cover("campus")},
    "gxu": {"cover_image_url": cover("campus")},
    "hebut": {"cover_image_url": cover("campus")},
    "nmu": {"cover_image_url": cover("campus")},
    "imnu": {"cover_image_url": cover("campus")},
    "just": {"cover_image_url": cover("nanjing")},
    "cjlu": {"cover_image_url": cover("hangzhou")},
    "xju": {"cover_image_url": cover("campus")},
    "bhu": {"cover_image_url": cover("campus")},
    "qhnu": {"cover_image_url": cover("campus")},
}


def run():
    engine = create_engine(DATABASE_URL)
    updated = 0
    skipped = 0

    with engine.begin() as conn:
        for slug, imgs in IMAGES.items():
            sets = []
            params: dict = {"slug": slug}

            if "logo_url" in imgs:
                sets.append("logo_url = :logo_url")
                params["logo_url"] = imgs["logo_url"]
            if "cover_image_url" in imgs:
                sets.append("cover_image_url = :cover_image_url")
                params["cover_image_url"] = imgs["cover_image_url"]

            if not sets:
                skipped += 1
                continue

            sql = f"UPDATE universities SET {', '.join(sets)} WHERE slug = :slug"
            result = conn.execute(text(sql), params)
            if result.rowcount > 0:
                updated += 1
                print(f"  ✓ {slug}")
            else:
                skipped += 1
                print(f"  ? {slug} — not found in DB")

    print(f"\nDone: {updated} updated, {skipped} skipped")


if __name__ == "__main__":
    run()
