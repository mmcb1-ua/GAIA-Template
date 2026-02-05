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
