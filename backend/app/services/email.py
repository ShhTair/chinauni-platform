from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from ..config import settings
import logging

logger = logging.getLogger(__name__)

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

fm = FastMail(conf)


async def send_welcome_email(email: str, temp_password: str):
    try:
        message = MessageSchema(
            subject="Добро пожаловать на ChinaUni!",
            recipients=[email],
            body=f"""
<h2>Добро пожаловать на ChinaUni!</h2>
<p>Ваш аккаунт был создан автоматически после заполнения формы.</p>
<p><strong>Email:</strong> {email}</p>
<p><strong>Пароль:</strong> {temp_password}</p>
<p>Войдите и обновите свои данные: <a href="{settings.FRONTEND_URL}/account">chinauni.kz/account</a></p>
<p><em>Команда ChinaUni</em></p>
            """,
            subtype=MessageType.html,
        )
        await fm.send_message(message)
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {e}")


async def send_verification_email(email: str, token: str):
    try:
        link = f"{settings.FRONTEND_URL}/verify-email/{token}"
        message = MessageSchema(
            subject="Подтвердите email — ChinaUni",
            recipients=[email],
            body=f"""
<h2>Подтвердите ваш email</h2>
<p><a href="{link}">Нажмите здесь для подтверждения</a></p>
            """,
            subtype=MessageType.html,
        )
        await fm.send_message(message)
    except Exception as e:
        logger.error(f"Failed to send verification email: {e}")
