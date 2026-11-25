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
    password = settings.first_admin_password
    if not password:
        raise RuntimeError("FIRST_ADMIN_PASSWORD must be set in the environment to seed the admin account.")

    async with AsyncSessionLocal() as db:
        existing = await db.scalar(select(User).where(User.email == email))
        if existing is None:
            admin = User(
                full_name=settings.first_admin_name,
                email=email,
                phone=None,
                password_hash=hash_password(password),
                role=UserRole.admin,
                is_active=True,
            )
            db.add(admin)
            print(f"Created admin account: {email}")
        else:
            print(f"Admin account already exists: {email}")

        await db.commit()


async def main() -> None:
    try:
        await seed_admin()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    configure_windows_event_loop()
    asyncio.run(main())
