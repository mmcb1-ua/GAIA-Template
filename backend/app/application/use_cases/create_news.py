import bleach
from app.presentation.schemas.news import NewsCreate
from app.domain.repositories.news_repository import NewsRepository
from app.infrastructure.models.news import News
from uuid import UUID

class CreateNews:
    def __init__(self, news_repository: NewsRepository):
        self.news_repository = news_repository

    async def execute(self, data: NewsCreate, author_id: UUID) -> News:
        # Sanitize content if present
        # Allowed tags/attributes can be configured here or loaded from config
        sanitized_content = None
        if data.content:
            sanitized_content = bleach.clean(
                data.content,
                tags=['p', 'b', 'i', 'u', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'br', 'span', 'div'],
                attributes={'*': ['class', 'style'], 'a': ['href', 'title', 'target']},
                strip=True
            )

        news = News(
            title=data.title,
            summary=data.summary,
            content=sanitized_content,
            cover_url=data.cover_url,
            scope=data.scope,
            author_id=author_id,
            # Status defaults to DRAFT in model
        )
        
        return await self.news_repository.create(news)
