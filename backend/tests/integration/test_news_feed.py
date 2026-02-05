# [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-BE-T02]
import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.models.news import News
from app.infrastructure.repositories.news_repository_impl import NewsRepositoryImpl
from app.domain.enums import NewsStatus, NewsScope
import uuid

@pytest.mark.asyncio
async def test_feed_public_user_sees_only_general(db_session: AsyncSession):
    """
    Given: 1 General PUBLISHED and 1 Internal PUBLISHED article
    When: Repository.list_published is called with scope=GENERAL
    Then: Only the General article is returned
    """
    repo = NewsRepositoryImpl(db_session)
    author_id = uuid.uuid4()
    
    # Ensure author exists
    await db_session.execute(text(
        "INSERT INTO users (id, email, role) "
        f"VALUES ('{author_id}', 'author@example.com', 'ADMIN') "
        "ON CONFLICT (id) DO NOTHING"
    ))
    
    # Create General news
    general_news = News(
        title="General News",
        content="Public content",
        author_id=author_id,
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.GENERAL,
        is_deleted=False
    )
    
    # Create Internal news
    internal_news = News(
        title="Internal News",
        content="Internal content",
        author_id=author_id,
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.INTERNAL_ASOCIACION,
        is_deleted=False
    )
    
    db_session.add(general_news)
    db_session.add(internal_news)
    await db_session.flush()
    
    # When: Listing with scope=GENERAL (public user)
    results = await repo.list_published(scope=NewsScope.GENERAL)
    
    # Then: Only general news is returned
    titles = [n.title for n in results]
    assert "General News" in titles
    assert "Internal News" not in titles


@pytest.mark.asyncio
async def test_feed_member_sees_all_published(db_session: AsyncSession):
    """
    Given: 1 General PUBLISHED and 1 Internal PUBLISHED article
    When: Repository.list_published is called with scope=None (member)
    Then: Both articles are returned
    """
    repo = NewsRepositoryImpl(db_session)
    author_id = uuid.uuid4()
    
    await db_session.execute(text(
        "INSERT INTO users (id, email, role) "
        f"VALUES ('{author_id}', 'member@example.com', 'MEMBER') "
        "ON CONFLICT (id) DO NOTHING"
    ))
    
    general_news = News(
        title="General Article",
        content="Public content",
        author_id=author_id,
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.GENERAL,
        is_deleted=False
    )
    
    internal_news = News(
        title="Internal Article",
        content="Internal content",
        author_id=author_id,
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.INTERNAL_ASOCIACION,
        is_deleted=False
    )
    
    db_session.add(general_news)
    db_session.add(internal_news)
    await db_session.flush()
    
    # When: Listing with scope=None (member sees all)
    results = await repo.list_published(scope=None)
    
    # Then: Both are returned
    titles = [n.title for n in results]
    assert "General Article" in titles
    assert "Internal Article" in titles


@pytest.mark.asyncio
async def test_feed_excludes_drafts_and_deleted(db_session: AsyncSession):
    """
    Given: 1 PUBLISHED, 1 DRAFT, and 1 DELETED article
    When: Repository.list_published is called
    Then: Only the PUBLISHED article is returned
    """
    repo = NewsRepositoryImpl(db_session)
    author_id = uuid.uuid4()
    
    await db_session.execute(text(
        "INSERT INTO users (id, email, role) "
        f"VALUES ('{author_id}', 'test@example.com', 'ADMIN') "
        "ON CONFLICT (id) DO NOTHING"
    ))
    
    published = News(
        title="Published",
        content="Content",
        author_id=author_id,
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.GENERAL,
        is_deleted=False
    )
    
    draft = News(
        title="Draft",
        content="Content",
        author_id=author_id,
        status=NewsStatus.DRAFT,
        scope=NewsScope.GENERAL,
        is_deleted=False
    )
    
    deleted = News(
        title="Deleted",
        content="Content",
        author_id=author_id,
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.GENERAL,
        is_deleted=True
    )
    
    db_session.add_all([published, draft, deleted])
    await db_session.flush()
    
    # When: Listing published
    results = await repo.list_published()
    
    # Then: Only published, non-deleted
    titles = [n.title for n in results]
    assert "Published" in titles
    assert "Draft" not in titles
    assert "Deleted" not in titles


@pytest.mark.asyncio
async def test_feed_pagination(db_session: AsyncSession):
    """
    Given: 5 published articles
    When: Repository.list_published is called with limit=2, offset=1
    Then: 2 articles are returned, skipping the first one
    """
    repo = NewsRepositoryImpl(db_session)
    author_id = uuid.uuid4()
    
    await db_session.execute(text(
        "INSERT INTO users (id, email, role) "
        f"VALUES ('{author_id}', 'paginator@example.com', 'ADMIN') "
        "ON CONFLICT (id) DO NOTHING"
    ))
    
    for i in range(5):
        news = News(
            title=f"Article {i}",
            content="Content",
            author_id=author_id,
            status=NewsStatus.PUBLISHED,
            scope=NewsScope.GENERAL,
            is_deleted=False
        )
        db_session.add(news)
    
    await db_session.flush()
    
    # When: Paginating
    results = await repo.list_published(limit=2, offset=1)
    
    # Then: Exactly 2 results
    assert len(results) == 2
