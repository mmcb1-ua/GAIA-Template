# [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-DB-T01]
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.infrastructure.models.news import News
from app.infrastructure.repositories.news_repository_impl import NewsRepositoryImpl
from app.domain.enums import NewsStatus, NewsScope
import uuid

@pytest.mark.asyncio
async def test_news_soft_delete_db_infra(db_session: AsyncSession):
    # Given: A repository and an author
    repo = NewsRepositoryImpl(db_session)
    author_id = uuid.uuid4()
    
    # Ensure author exists (minimal user insertion)
    await db_session.execute(text(
        "INSERT INTO users (id, email, role) "
        f"VALUES ('{author_id}', 'author@example.com', 'ADMIN') "
        "ON CONFLICT (id) DO NOTHING"
    ))
    
    # And two news articles
    news1 = News(
        title="Active News",
        content="Content 1",
        author_id=author_id,
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.GENERAL,
        is_deleted=False
    )
    news2 = News(
        title="Deleted News",
        content="Content 2",
        author_id=author_id,
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.GENERAL,
        is_deleted=True
    )
    
    db_session.add(news1)
    db_session.add(news2)
    await db_session.flush()

    # When: Listing active news (default)
    active_news = await repo.list(include_deleted=False)

    # Then: Only news1 should be returned
    assert len(active_news) >= 1
    titles = [n.title for n in active_news]
    assert "Active News" in titles
    assert "Deleted News" not in titles

    # When: Listing including deleted
    all_news = await repo.list(include_deleted=True)

    # Then: Both should be present
    titles_all = [n.title for n in all_news]
    assert "Active News" in titles_all
    assert "Deleted News" in titles_all

@pytest.mark.asyncio
async def test_news_soft_delete_method(db_session: AsyncSession):
    # Given: A repository and a news article
    repo = NewsRepositoryImpl(db_session)
    author_id = uuid.uuid4()
    
    await db_session.execute(text(
        "INSERT INTO users (id, email, role) "
        f"VALUES ('{author_id}', 'author2@example.com', 'ADMIN') "
        "ON CONFLICT (id) DO NOTHING"
    ))
    
    news = News(
        title="To be deleted",
        content="Content",
        author_id=author_id,
        status=NewsStatus.DRAFT,
        scope=NewsScope.GENERAL,
        is_deleted=False
    )
    
    await repo.create(news)
    
    # When: Calling delete method
    await repo.delete(news)
    
    # Then: is_deleted should be True
    assert news.is_deleted is True
    
    # And it should not appear in active list
    active_news = await repo.list(include_deleted=False)
    assert news.id not in [n.id for n in active_news]
