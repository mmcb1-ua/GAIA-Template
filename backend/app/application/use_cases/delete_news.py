from app.domain.repositories.news_repository import NewsRepository
from app.infrastructure.models.news import News
from uuid import UUID
from typing import Optional

class DeleteNews:
    def __init__(self, news_repository: NewsRepository):
        self.news_repository = news_repository

    async def execute(self, news_id: UUID) -> bool:
        # [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-BE-T02]
        news = await self.news_repository.get_by_id(news_id)
        if not news or news.is_deleted:
            return False

        await self.news_repository.delete(news)
        return True
