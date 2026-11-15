import asyncio

from sqlalchemy import select

from app.core.config import settings
from app.core.eventloop import configure_windows_event_loop
from app.core.security import hash_password
from app.database.session import AsyncSessionLocal, engine
from app.models.enums import UserRole
from app.models.user import User


async def seed_admin() -> None:
    email = settings.first_admin_email.lower()
    async with AsyncSessionLocal() as db:
        existing = await db.scalar(select(User).where(User.email == email))
        if existing is not None:
            print(f"Admin already exists: {email}")
            return

        admin = User(
            full_name=settings.first_admin_name,
            email=email,
            phone=None,
            password_hash=hash_password(settings.first_admin_password),
            role=UserRole.admin,
            is_active=True,
        )
        db.add(admin)
        await db.commit()
        print(f"Created admin account: {email}")


async def main() -> None:
    try:
        await seed_admin()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    configure_windows_event_loop()
    asyncio.run(main())
