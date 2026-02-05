from typing import Optional, List
from app.domain.repositories.news_repository import NewsRepository
from app.infrastructure.models.news import News
from app.domain.enums import NewsScope

class ListNewsFeed:
    """
    Use case for retrieving the news feed with role-based filtering.
    
    Public users (unauthenticated or non-members) see only GENERAL news.
    Members and admins see all published news (GENERAL + INTERNAL).
    """
    
    def __init__(self, repository: NewsRepository):
        self.repository = repository
    
    async def execute(
        self,
        is_member: bool = False,
        limit: int = 100,
        offset: int = 0
    ) -> List[News]:
        """
        Retrieve the news feed based on user role.
        
        Args:
            is_member: True if the user is authenticated as a member or admin.
            limit: Maximum number of articles to return.
            offset: Number of articles to skip (for pagination).
        
        Returns:
            List of published news articles filtered by role.
        """
        # [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-BE-T02]
        
        # Public users (non-members) see only GENERAL news
        if not is_member:
            scope = NewsScope.GENERAL
        else:
            # Members and admins see all published news
            scope = None
        
        return await self.repository.list_published(
            scope=scope,
            limit=limit,
            offset=offset
        )
