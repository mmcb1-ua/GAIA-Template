from typing import Optional
from uuid import UUID
from abc import ABC, abstractmethod
from app.infrastructure.models.news import News

class NewsRepository(ABC):
    @abstractmethod
    async def create(self, news: News) -> News:
        """Create a new news article in default DRAFT status."""
        pass

    @abstractmethod
    async def get_by_id(self, id: UUID) -> Optional[News]:
        """Retrieve a news article by its ID."""
        pass

    @abstractmethod
    async def update(self, news: News) -> News:
        """Update an existing news article."""
        pass
