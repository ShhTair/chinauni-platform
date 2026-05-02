from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/chinauni"
    SECRET_KEY: str = "dev-secret-key-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@chinauni.kz"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_FROM_NAME: str = "ChinaUni"

    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
