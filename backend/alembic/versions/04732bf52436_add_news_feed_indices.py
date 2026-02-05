"""add_news_feed_indices

Revision ID: 04732bf52436
Revises: 53ca5d89b23c
Create Date: 2026-02-05 22:42:10.261644

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '04732bf52436'
down_revision: Union[str, None] = '53ca5d89b23c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-DB-T01]
    op.create_index(
        'ix_news_feed_composite',
        'news',
        ['is_deleted', 'status', sa.text('published_at DESC')]
    )


def downgrade() -> None:
    # [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-DB-T01]
    op.drop_index('ix_news_feed_composite', table_name='news')
