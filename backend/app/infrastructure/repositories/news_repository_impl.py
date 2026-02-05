from typing import Optional, List
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.news_repository import NewsRepository
from app.infrastructure.models.news import News
from app.domain.enums import NewsStatus, NewsScope

class NewsRepositoryImpl(NewsRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, news: News) -> News:
        self.session.add(news)
        await self.session.flush()
        await self.session.refresh(news)
        return news

    async def get_by_id(self, id: UUID) -> Optional[News]:
        return await self.session.get(News, id)

    async def update(self, news: News) -> News:
        await self.session.flush()
        await self.session.refresh(news)
        return news

    async def list(self, include_deleted: bool = False) -> List[News]:
        # [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-ADMIN-003-DB-T01]
        query = select(News)
        if not include_deleted:
            query = query.where(News.is_deleted == False)
        
        result = await self.session.execute(query)
        return list(result.scalars().all())


    async def delete(self, news: News) -> News:
        # [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-DB-T01]
        news.is_deleted = True
        await self.session.flush()
        await self.session.refresh(news)
        return news

    async def list_published(
        self,
        scope: Optional[NewsScope] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[News]:
        """
        List published news articles with optional scope filtering and pagination.
        
        Args:
            scope: If provided, filter by scope (e.g., GENERAL for public users).
                   If None, return all published news (for members/admins).
            limit: Maximum number of results to return.
            offset: Number of results to skip.
        
        Returns:
            List of published, non-deleted news articles ordered by published_at DESC.
        """
        # [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-BE-T02]
        query = (
            select(News)
            .where(News.status == NewsStatus.PUBLISHED)
            .where(News.is_deleted == False)
        )
        
        if scope is not None:
            query = query.where(News.scope == scope)
        
        query = query.order_by(News.published_at.desc()).limit(limit).offset(offset)
        
        result = await self.session.execute(query)
        return list(result.scalars().all())
