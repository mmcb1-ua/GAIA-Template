from typing import Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.news_repository import NewsRepository
from app.infrastructure.models.news import News

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

    async def list(self, include_deleted: bool = False) -> list[News]:
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
