# [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-DB-T01]
import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.mark.asyncio
async def test_news_feed_composite_index_exists(db_session: AsyncSession):
    # This query works for PostgreSQL to list indices on the 'news' table
    query = text("""
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'news';
    """)
    result = await db_session.execute(query)
    indices = result.fetchall()
    
    index_defs = [row[1].lower() for row in indices]
    
    # We are looking for a composite index that includes is_deleted, status, and published_at
    # Example expected: 'CREATE INDEX ix_news_feed_composite ON public.news USING btree (is_deleted, status, published_at DESC)'
    
    found = False
    for idef in index_defs:
        if "is_deleted" in idef and "status" in idef and "published_at" in idef:
            found = True
            # Optional: Check for DESC if possible, though exact string matching might be brittle
            break
            
    assert found, f"Expected composite index on (is_deleted, status, published_at) not found in {index_defs}"
