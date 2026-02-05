import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.main import app
from app.presentation.api.deps import get_current_admin

# Override auth
async def override_get_current_admin():
    return {"id": "12345678-1234-5678-1234-567812345678", "role": "ADMIN", "email": "admin@example.com"}

@pytest_asyncio.fixture(autouse=True)
async def admin_user(db_session: AsyncSession):
    # Insert Admin User safely using flush instead of commit for isolation
    from app.infrastructure.models.news import News # ensure app is initialized
    await db_session.execute(text(
        "INSERT INTO users (id, email, role) "
        "VALUES ('12345678-1234-5678-1234-567812345678', 'admin@example.com', 'ADMIN') "
        "ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email"
    ))
    await db_session.flush()
    yield

@pytest_asyncio.fixture(autouse=True)
async def auth_override():
    app.dependency_overrides[get_current_admin] = override_get_current_admin
    yield
    app.dependency_overrides.pop(get_current_admin, None)

@pytest.mark.asyncio
async def test_create_news_draft_happy_path(client: AsyncClient):
    # Given
    payload = {
        "title": "New Community Event",
        "summary": "Join us next week!",
        "content": "<p>Details here.</p>",
        "scope": "GENERAL",
        "cover_url": "http://example.com/image.jpg"
    }

    # When
    response = await client.post("/api/v1/news_articles", json=payload)

    # Then
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "DRAFT"
    assert "id" in data

@pytest.mark.asyncio
async def test_create_news_validation_failure(client: AsyncClient):
    # Given missing title
    payload = {
        "summary": "Missing title",
        "scope": "GENERAL"
    }
    
    # When
    response = await client.post("/api/v1/news_articles", json=payload)
    
    # Then
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_create_news_xss_sanitization(client: AsyncClient):
    # Given malicious content
    payload = {
        "title": "Hacked",
        "content": "<script>alert('xss')</script><p>Safe</p>",
        "scope": "GENERAL"
    }
    
    # When
    response = await client.post("/api/v1/news_articles", json=payload)
    
    # Then
    assert response.status_code == 201
    data = response.json()
    assert "<script>" not in data["content"]
    assert "<p>Safe</p>" in data["content"]
