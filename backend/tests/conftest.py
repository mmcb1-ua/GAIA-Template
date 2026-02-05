import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from typing import AsyncGenerator
from app.infrastructure.db.session import Base
from app.main import app
from httpx import AsyncClient, ASGITransport
import os

# Use local DB for testing if running outside docker, or the docker service name if inside
# For simplicity in this environment, we assume localhost mapping if running from host
# But strict rules say "run verification inside Docker".
# In this environment, we are "on the host" but interacting with Docker.
# Let's align with the `backend-testing.md` or `techstack-backend.md`.
# For now, I will use a sensible default that works with the docker-compose ports.
# Host port 5455 -> Container 5432.
# IF running tests FROM WITHIN the container, it's 'db:5432'.
# IF running tests FROM HOST, it's 'localhost:5455'.

# To support both, we check env.
_db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5455/gaia_db")
if "db:5432" in _db_url:
    # Inside Docker
    TEST_DATABASE_URL = _db_url.replace("postgresql://", "postgresql+asyncpg://")
else:
    # From Host
    TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5455/gaia_db"

# Real User Model for FK resolution
from app.infrastructure.models.user import User

@pytest.fixture
def admin_token_headers():
    return {"Authorization": "Bearer fake-admin-token"}

@pytest.fixture
def user_token_headers():
    return {"Authorization": "Bearer fake-user-token"}

@pytest_asyncio.fixture()
async def engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False, future=True)
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    yield engine
    
    # Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()

@pytest_asyncio.fixture()
async def db_session(engine) -> AsyncGenerator[AsyncSession, None]:
    async_session = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )
    async with async_session() as session:
        yield session
        await session.rollback() # Ensure rollback after each test

@pytest_asyncio.fixture()
async def client(db_session) -> AsyncGenerator[AsyncClient, None]:
    from app.infrastructure.db.session import get_db
    
    async def _override_get_db():
        yield db_session
        
    app.dependency_overrides[get_db] = _override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.pop(get_db, None)
