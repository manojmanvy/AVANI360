"""initial schema: users, properties, enquiries

Revision ID: 0001_initial
Revises:
Create Date: 2026-11-12

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


user_role = sa.Enum("buyer", "seller", "builder", "admin", name="user_role")
property_type = sa.Enum(
    "Residential Plot",
    "Apartment",
    "Villa",
    "Farm Land",
    "Commercial Plot",
    "Agricultural Land",
    name="property_type",
)
listing_status = sa.Enum("Pending", "Approved", "Rejected", name="listing_status")
enquiry_status = sa.Enum("New", "Contacted", "Closed", name="enquiry_status")


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("district", sa.String(length=80), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_users"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "properties",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("seller_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("property_type", property_type, nullable=False),
        sa.Column("district", sa.String(length=80), nullable=False),
        sa.Column("city", sa.String(length=80), nullable=True),
        sa.Column("locality", sa.String(length=120), nullable=True),
        sa.Column("price", sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column("area", sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column("area_unit", sa.String(length=20), nullable=False),
        sa.Column("bedrooms", sa.Integer(), nullable=True),
        sa.Column("bathrooms", sa.Integer(), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("amenities", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("documents", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("images", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("status", listing_status, nullable=False),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column("featured", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(
            ["seller_id"], ["users.id"], name="fk_properties_seller_id_users", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_properties"),
    )
    op.create_index("ix_properties_seller_id", "properties", ["seller_id"])
    op.create_index("ix_properties_district", "properties", ["district"])
    op.create_index("ix_properties_status", "properties", ["status"])

    op.create_table(
        "enquiries",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("property_id", sa.Uuid(), nullable=False),
        sa.Column("seller_id", sa.Uuid(), nullable=False),
        sa.Column("buyer_id", sa.Uuid(), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("preferred_date", sa.String(length=40), nullable=True),
        sa.Column("status", enquiry_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(
            ["property_id"],
            ["properties.id"],
            name="fk_enquiries_property_id_properties",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["seller_id"], ["users.id"], name="fk_enquiries_seller_id_users", ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["buyer_id"], ["users.id"], name="fk_enquiries_buyer_id_users", ondelete="SET NULL"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_enquiries"),
    )
    op.create_index("ix_enquiries_property_id", "enquiries", ["property_id"])
    op.create_index("ix_enquiries_seller_id", "enquiries", ["seller_id"])
    op.create_index("ix_enquiries_buyer_id", "enquiries", ["buyer_id"])
    op.create_index("ix_enquiries_status", "enquiries", ["status"])


def downgrade() -> None:
    op.drop_table("enquiries")
    op.drop_table("properties")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS enquiry_status")
    op.execute("DROP TYPE IF EXISTS listing_status")
    op.execute("DROP TYPE IF EXISTS property_type")
    op.execute("DROP TYPE IF EXISTS user_role")
