from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .config import settings
from .database import Base, engine
from .middleware.rate_limit import limiter, rate_limit_handler
from .routers import auth, universities, scholarships, deadlines, applications, intake, admin, profile, admin_api, submissions

app = FastAPI(title="ChinaUni API", version="1.0.0", docs_url="/api/docs")

# Rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables

# Routers
app.include_router(auth.router)
app.include_router(universities.router)
app.include_router(submissions.router)
app.include_router(scholarships.router)
app.include_router(deadlines.router)
app.include_router(applications.router)
app.include_router(intake.router)
app.include_router(admin.router)
app.include_router(admin_api.router)
app.include_router(profile.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
