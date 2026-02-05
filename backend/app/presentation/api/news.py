from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.db.session import get_db
from app.presentation.schemas.news import NewsCreate, NewsResponse, NewsStatusUpdate, NewsUpdate, NewsFeedResponse
from app.application.use_cases.create_news import CreateNews
from app.application.use_cases.publish_news import PublishNews
from app.application.use_cases.update_news import UpdateNews
from app.application.use_cases.delete_news import DeleteNews
from app.application.use_cases.list_news_feed import ListNewsFeed
from app.infrastructure.repositories.news_repository_impl import NewsRepositoryImpl
from app.presentation.api.deps import get_current_admin, get_current_user
from typing import Optional
from uuid import UUID
from app.presentation.schemas.news import NewsStatus

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

@router.patch("/news_articles/{id}/status", response_model=NewsResponse)
async def patch_news_status(
    id: UUID,
    data: NewsStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    # Traceability: [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-BE-T02]
    
    # Simple check for now: we only care if status is being set to PUBLISHED
    # In a real app we might have a proper state machine in the use case.
    
    repo = NewsRepositoryImpl(db)
    
    if data.status == NewsStatus.PUBLISHED:
        use_case = PublishNews(repo)
        await use_case.execute(id)
    else:
        # For other status changes (e.g. DRAFT -> ARCHIVED), we'd need another use case
        # For now, let's keep it scoped to publishing as per ticket.
        pass
        
    return await repo.get_by_id(id)

@router.put("/news_articles/{id}", response_model=NewsResponse)
async def update_news_article(
    id: UUID,
    data: NewsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Update a news article content.
    Requires ADMIN role.
    """
    # Traceability: [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-BE-T02]
    
    repo = NewsRepositoryImpl(db)
    use_case = UpdateNews(repo)
    
    updated = await use_case.execute(id, data)
    if not updated:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="News article not found")
        
    return updated

@router.delete("/news_articles/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_news_article(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Soft-delete a news article.
    Requires ADMIN role.
    """
    # Traceability: [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-BE-T02]
    
    repo = NewsRepositoryImpl(db)
    use_case = DeleteNews(repo)
    
    success = await use_case.execute(id)
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="News article not found")
        
    return None


@router.get("/news_articles/{id}", response_model=NewsResponse)
async def get_news_detail(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    # Optional auth to support both public and member access
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Get a news article by ID.
    
    - If article is GENERAL: Accessible to everyone (Public).
    - If article is INTERNAL: Accessible only to authenticated MEMBERS/ADMINS.
    - If article is DRAFT/DELETED: Not found (404) unless Admin (Admin preview logic not yet enforced, assumed hidden).
    """
    # [Feature: News Management] [Story: NEWS-VIEW-002] [Ticket: NEWS-VIEW-002-BE-T02]
    
    from app.application.use_cases.get_news_detail import GetNewsDetail
    from fastapi import HTTPException
    
    repo = NewsRepositoryImpl(db)
    use_case = GetNewsDetail(repo)
    
    try:
        news = await use_case.execute(id, current_user)
    except PermissionError:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
         
    if not news:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="News article not found")
        
    return news

@router.get("/news_articles", response_model=NewsFeedResponse)
async def get_news_feed(
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Retrieve the news feed with role-based filtering.
    
    - Public users (unauthenticated): See only GENERAL news
    - Members/Admins (authenticated): See all published news (GENERAL + INTERNAL)
    - Drafts are hidden.
    
    Pagination is supported via limit and offset query parameters.
    """
    # [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-BE-T02]
    
    repo = NewsRepositoryImpl(db)
    use_case = ListNewsFeed(repo)
    
    # Determine if user is a member/admin
    # In a real app, this would check the user's role from the auth system
    # For now, we assume current_user is None for public, and has a role otherwise
    is_member = current_user is not None
    
    items = await use_case.execute(
        is_member=is_member,
        limit=limit,
        offset=offset
    )
    
    # Convert to response models
    response_items = [NewsResponse.model_validate(item) for item in items]
    
    return NewsFeedResponse(
        items=response_items,
        total=len(response_items),  # In production, you'd query the total count separately
        limit=limit,
        offset=offset
    )
