"""secure password reset OTP

Revision ID: 0004_secure_reset_otp
Revises: 0003_add_reset_otp
Create Date: 2026-11-25

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0004_secure_reset_otp"
down_revision: str | None = "0003_add_reset_otp"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column(
        "users",
        "reset_otp",
        existing_type=sa.String(length=6),
        type_=sa.String(length=255),
        existing_nullable=True,
    )
    op.add_column(
        "users",
        sa.Column("reset_otp_attempts", sa.Integer(), server_default="0", nullable=False),
    )
    op.alter_column("users", "reset_otp_attempts", server_default=None)


def downgrade() -> None:
    op.drop_column("users", "reset_otp_attempts")
    op.alter_column(
        "users",
        "reset_otp",
        existing_type=sa.String(length=255),
        type_=sa.String(length=6),
        existing_nullable=True,
    )
