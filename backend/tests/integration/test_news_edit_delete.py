import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.main import app
from app.presentation.api.deps import get_current_admin
from uuid import UUID
import uuid

# [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-BE-T02]

# Override auth
async def override_get_current_admin():
    return {"id": "12345678-1234-5678-1234-567812345678", "role": "ADMIN", "email": "admin@example.com"}

@pytest.fixture(autouse=True)
async def admin_user(db_session: AsyncSession):
    await db_session.execute(text(
        "INSERT INTO users (id, email, role) "
        "VALUES ('12345678-1234-5678-1234-567812345678', 'admin@example.com', 'ADMIN') "
        "ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email"
    ))
    await db_session.flush()
    yield

@pytest.fixture(autouse=True)
async def auth_override():
    app.dependency_overrides[get_current_admin] = override_get_current_admin
    yield
    app.dependency_overrides.pop(get_current_admin, None)

@pytest.mark.asyncio
async def test_update_news_happy_path(client: AsyncClient, db_session: AsyncSession):
    # Given: An existing news article
    author_id = "12345678-1234-5678-1234-567812345678"
    from app.infrastructure.models.news import News
    from app.domain.enums import NewsStatus, NewsScope
    
    news = News(
        title="Original Title",
        content="Original Content",
        author_id=author_id,
        status=NewsStatus.DRAFT,
        scope=NewsScope.GENERAL
    )
    db_session.add(news)
    await db_session.flush()
    news_id = news.id

    # When: Updating the title and content
    payload = {
        "title": "Updated Title",
        "content": "<p>Updated Content</p>"
    }
    response = await client.put(f"/api/v1/news_articles/{news_id}", json=payload)

    # Then
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["content"] == "<p>Updated Content</p>"

@pytest.mark.asyncio
async def test_update_news_sanitization(client: AsyncClient, db_session: AsyncSession):
    # Given
    author_id = "12345678-1234-5678-1234-567812345678"
    from app.infrastructure.models.news import News
    
    news = News(
        title="Article",
        content="Content",
        author_id=author_id
    )
    db_session.add(news)
    await db_session.flush()
    news_id = news.id

    # When: Updating with malicious content
    payload = {
        "content": "<script>alert('xss')</script><p>Safe</p>"
    }
    response = await client.put(f"/api/v1/news_articles/{news_id}", json=payload)

    # Then
    assert response.status_code == 200
    data = response.json()
    assert "<script>" not in data["content"]
    assert "<p>Safe</p>" in data["content"]

@pytest.mark.asyncio
async def test_delete_news_soft_delete(client: AsyncClient, db_session: AsyncSession):
    # Given
    author_id = "12345678-1234-5678-1234-567812345678"
    from app.infrastructure.models.news import News
    
    news = News(
        title="To Delete",
        content="Content",
        author_id=author_id
    )
    db_session.add(news)
    await db_session.flush()
    news_id = news.id

    # When: Deleting the article
    response = await client.delete(f"/api/v1/news_articles/{news_id}")

    # Then
    assert response.status_code == 204
    
    # Verify it's soft-deleted in DB
    await db_session.refresh(news)
    assert news.is_deleted is True

@pytest.mark.asyncio
async def test_update_news_not_found(client: AsyncClient):
    # When: Updating non-existent article
    fake_id = str(uuid.uuid4())
    payload = {"title": "New Title"}
    response = await client.put(f"/api/v1/news_articles/{fake_id}", json=payload)
    
    # Then
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_delete_news_not_found(client: AsyncClient):
    # When: Deleting non-existent article
    fake_id = str(uuid.uuid4())
    response = await client.delete(f"/api/v1/news_articles/{fake_id}")
    
    # Then
    assert response.status_code == 404
