from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.db.session import get_db
from app.presentation.schemas.news import NewsCreate, NewsResponse
from app.application.use_cases.create_news import CreateNews
from app.infrastructure.repositories.news_repository_impl import NewsRepositoryImpl
from app.presentation.api.deps import get_current_admin

router = APIRouter()

@router.post("/news_articles", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
async def create_news_draft(
    data: NewsCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Create a new news article draft.
    Requires ADMIN role.
    """
    # Traceability: [Feature: News Management] [Story: NEWS-ADMIN-001] [Ticket: NEWS-ADMIN-001-BE-T02]
    
    # Wiring
    repo = NewsRepositoryImpl(db)
    use_case = CreateNews(repo)
    
    # Execute
    # Assuming current_user dict has 'id'
    # In real app, user model/schema would be used
    author_id = current_user.get("id")
    
    return await use_case.execute(data, author_id)
