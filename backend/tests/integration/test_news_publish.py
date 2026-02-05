import pytest
from httpx import AsyncClient
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.domain.enums import NewsStatus
from app.main import app
from app.presentation.api.deps import get_current_admin

# Override auth
async def override_get_current_admin():
    return {"id": "12345678-1234-5678-1234-567812345678", "role": "ADMIN", "email": "admin@example.com"}

async def override_get_current_user():
    from fastapi import HTTPException, status
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

@pytest.fixture(autouse=True)
async def admin_user_fixture(db_session: AsyncSession):
    await db_session.execute(text(
        "INSERT INTO users (id, email, role, is_admin) "
        "VALUES ('12345678-1234-5678-1234-567812345678', 'admin@example.com', 'ADMIN', True) "
        "ON CONFLICT (id) DO NOTHING"
    ))
    await db_session.flush()

@pytest.fixture
async def admin_auth_override():
    app.dependency_overrides[get_current_admin] = override_get_current_admin
    yield
    app.dependency_overrides.pop(get_current_admin, None)

@pytest.fixture
async def user_auth_override():
    app.dependency_overrides[get_current_admin] = override_get_current_user
    yield
    app.dependency_overrides.pop(get_current_admin, None)

@pytest.mark.asyncio
async def test_publish_news_success(client: AsyncClient, admin_auth_override):
    # 1. Create a draft
    payload = {
        "title": "Draft to be published",
        "content": "<p>Some content</p>",
        "scope": "GENERAL"
    }
    create_response = await client.post(
        "/api/v1/news_articles",
        json=payload
    )
    assert create_response.status_code == 201
    news_id = create_response.json()["id"]

    # 2. Publish it
    publish_payload = {"status": "PUBLISHED"}
    response = await client.patch(
        f"/api/v1/news_articles/{news_id}/status",
        json=publish_payload
    )

    # 3. Verify
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "PUBLISHED"
    assert data["published_at"] is not None

@pytest.mark.asyncio
async def test_publish_news_unauthorized(client: AsyncClient, user_auth_override):
    news_id = str(uuid4())
    publish_payload = {"status": "PUBLISHED"}
    
    response = await client.patch(
        f"/api/v1/news_articles/{news_id}/status",
        json=publish_payload
    )
    
    # [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-BE-T02]
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_publish_news_not_found(client: AsyncClient, admin_auth_override):
    news_id = str(uuid4())
    publish_payload = {"status": "PUBLISHED"}
    
    response = await client.patch(
        f"/api/v1/news_articles/{news_id}/status",
        json=publish_payload
    )
    
    assert response.status_code == 404
