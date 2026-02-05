from datetime import datetime, timezone
from uuid import UUID
from fastapi import HTTPException, status
from app.domain.repositories.news_repository import NewsRepository
from app.domain.enums import NewsStatus

class PublishNews:
    def __init__(self, repository: NewsRepository):
        self.repository = repository

    async def execute(self, news_id: UUID) -> None:
        # Traceability: [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-BE-T02]
        
        # 1. Fetch
        news = await self.repository.get_by_id(news_id)
        if not news:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="News article not found"
            )
            
        # 2. Logic: DRAFT -> PUBLISHED
        # In this ticket, we allow transitioning to PUBLISHED. 
        # If already published, we update the timestamp (or could decide to ignore).
        news.status = NewsStatus.PUBLISHED
        news.published_at = datetime.now(timezone.utc)
        
        # 3. Save
        await self.repository.update(news)
