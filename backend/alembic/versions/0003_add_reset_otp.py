"""add reset_otp to users

Revision ID: 0003_add_reset_otp
Revises: 0002_property_details
Create Date: 2026-11-23

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0003_add_reset_otp"
down_revision: str | None = "0002_property_details"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("users", sa.Column("reset_otp", sa.String(length=6), nullable=True))
    op.add_column("users", sa.Column("reset_otp_expires_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "reset_otp_expires_at")
    op.drop_column("users", "reset_otp")
