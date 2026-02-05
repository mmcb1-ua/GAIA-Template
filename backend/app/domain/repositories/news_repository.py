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

    @abstractmethod
    async def list(self, include_deleted: bool = False) -> list[News]:
        """List news articles, optionally including deleted ones."""
        pass

    @abstractmethod
    async def delete(self, news: News) -> News:
        """Soft delete a news article."""
        pass
