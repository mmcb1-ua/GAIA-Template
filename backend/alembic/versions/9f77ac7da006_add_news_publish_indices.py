"""add_news_publish_indices

Revision ID: 9f77ac7da006
Revises: ceb5d5b41298
Create Date: 2026-02-05 21:24:23.147519

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9f77ac7da006'
down_revision: Union[str, None] = 'ceb5d5b41298'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-DB-T01]
    op.create_index('ix_news_status_scope', 'news', ['status', 'scope'], unique=False)


def downgrade() -> None:
    # [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-DB-T01]
    op.drop_index('ix_news_status_scope', table_name='news')
