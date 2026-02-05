
import pytest
from httpx import AsyncClient
from uuid import uuid4
from datetime import datetime
from app.main import app
from app.presentation.api.deps import get_current_user

@pytest.mark.asyncio
async def test_get_news_detail_security(client: AsyncClient, db_session):
    # 1. Setup Data
    author_id = uuid4()
    # Create Author
    user = User(id=author_id, email=f"auth_sec_{author_id}@example.com", full_name="Sec Author", role="ADMIN")
    db_session.add(user)
    
    # Create General Article
    gen_id = uuid4()
    gen_news = News(
        id=gen_id,
        title="General News",
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.GENERAL,
        author_id=author_id,
        published_at=datetime(2024, 1, 1, 12, 0, 0)
    )
    db_session.add(gen_news)
    
    # Create Internal Article
    int_id = uuid4()
    int_news = News(
        id=int_id,
        title="Internal News",
        status=NewsStatus.PUBLISHED,
        scope=NewsScope.INTERNAL_ASOCIACION,
        author_id=author_id,
        published_at=datetime(2024, 1, 1, 12, 0, 0)
    )
    db_session.add(int_news)
    
    await db_session.commit()
    
    # 2. Test Scenarios
    
    # A. Public User (No Header) -> General News -> 200
    resp = await client.get(f"/api/v1/news_articles/{gen_id}")
    assert resp.status_code == 200
    assert resp.json()["title"] == "General News"
    
    # B. Public User -> Internal News -> 403
    resp = await client.get(f"/api/v1/news_articles/{int_id}")
    assert resp.status_code == 403

@pytest.mark.asyncio
async def test_get_news_detail_internal_access_forbidden(client: AsyncClient, db_session):
    # Same setup, focused test
    author_id = uuid4()
    user = User(id=author_id, email=f"auth_forbid_{author_id}@example.com", role="ADMIN")
    db_session.add(user)
    
    int_id = uuid4()
    int_news = News(id=int_id, title="Secret", status=NewsStatus.PUBLISHED, scope=NewsScope.INTERNAL_ASOCIACION, author_id=author_id)
    db_session.add(int_news)
    await db_session.commit()
    
    # Public access
    resp = await client.get(f"/api/v1/news_articles/{int_id}")
    assert resp.status_code == 403

@pytest.mark.asyncio
async def test_get_news_detail_internal_access_allowed_for_member(client: AsyncClient, db_session):
    # Setup
    author_id = uuid4()
    user = User(id=author_id, email=f"auth_allow_{author_id}@example.com", role="ADMIN")
    db_session.add(user)
    
    int_id = uuid4()
    int_news = News(id=int_id, title="Secret", status=NewsStatus.PUBLISHED, scope=NewsScope.INTERNAL_ASOCIACION, author_id=author_id)
    db_session.add(int_news)
    await db_session.commit()
    
    # Authenticated Member Access
    async def mock_get_current_user():
        return {"id": str(uuid4()), "role": "MEMBER", "is_active": True}
        
    app.dependency_overrides[get_current_user] = mock_get_current_user
    
    try:
        resp = await client.get(f"/api/v1/news_articles/{int_id}")
        assert resp.status_code == 200
        assert resp.json()["id"] == str(int_id)
    finally:
        app.dependency_overrides.pop(get_current_user, None)

@pytest.mark.asyncio
async def test_get_news_detail_not_found(client: AsyncClient):
    resp = await client.get(f"/api/v1/news_articles/{uuid4()}")
    assert resp.status_code == 404
