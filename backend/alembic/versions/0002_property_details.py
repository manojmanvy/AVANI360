"""add property detail fields

Revision ID: 0002_property_details
Revises: 0001_initial
Create Date: 2026-11-12

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0002_property_details"
down_revision: str | None = "0001_initial"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("properties", sa.Column("dimensions", sa.String(length=60), nullable=True))
    op.add_column("properties", sa.Column("facing", sa.String(length=20), nullable=True))
    op.add_column("properties", sa.Column("ownership", sa.String(length=80), nullable=True))
    op.add_column("properties", sa.Column("map_link", sa.String(length=500), nullable=True))
    op.add_column(
        "properties",
        sa.Column(
            "highlights",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'[]'::jsonb"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("properties", "highlights")
    op.drop_column("properties", "map_link")
    op.drop_column("properties", "ownership")
    op.drop_column("properties", "facing")
    op.drop_column("properties", "dimensions")
