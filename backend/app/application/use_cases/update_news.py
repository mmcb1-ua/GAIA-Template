import bleach
from app.presentation.schemas.news import NewsUpdate
from app.domain.repositories.news_repository import NewsRepository
from app.infrastructure.models.news import News
from uuid import UUID
from typing import Optional

class UpdateNews:
    def __init__(self, news_repository: NewsRepository):
        self.news_repository = news_repository

    async def execute(self, news_id: UUID, data: NewsUpdate) -> Optional[News]:
        # [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-BE-T02]
        news = await self.news_repository.get_by_id(news_id)
        if not news or news.is_deleted:
            return None

        # Update fields if provided
        if data.title is not None:
            news.title = data.title
        if data.summary is not None:
            news.summary = data.summary
        if data.cover_url is not None:
            news.cover_url = data.cover_url
        if data.scope is not None:
            news.scope = data.scope
            
        if data.content is not None:
            # Re-sanitize on edit
            news.content = bleach.clean(
                data.content,
                tags=['p', 'b', 'i', 'u', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'br', 'span', 'div'],
                attributes={'*': ['class', 'style'], 'a': ['href', 'title', 'target']},
                strip=True
            )

        return await self.news_repository.update(news)
