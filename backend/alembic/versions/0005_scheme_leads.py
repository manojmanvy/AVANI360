"""create scheme_leads table

Revision ID: 0005_scheme_leads
Revises: 0004_secure_reset_otp
Create Date: 2026-11-25

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0005_scheme_leads"
down_revision: str | None = "0004_secure_reset_otp"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "scheme_leads",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("district", sa.String(length=80), nullable=False),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("is_contacted", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_scheme_leads_created_at"), "scheme_leads", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_scheme_leads_created_at"), table_name="scheme_leads")
    op.drop_table("scheme_leads")
