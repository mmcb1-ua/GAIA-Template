from abc import ABC, abstractmethod
from app.infrastructure.models.news import News

class NewsRepository(ABC):
    @abstractmethod
    async def create(self, news: News) -> News:
        """Create a new news article in default DRAFT status."""
        pass
