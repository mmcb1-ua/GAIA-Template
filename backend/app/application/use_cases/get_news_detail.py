
from uuid import UUID
from typing import Optional, Dict
from app.domain.repositories.news_repository import NewsRepository
from app.infrastructure.models.news import News
from app.domain.enums import NewsStatus, NewsScope

class GetNewsDetail:
    def __init__(self, repository: NewsRepository):
        self.repository = repository
        
    async def execute(self, news_id: UUID, current_user: Optional[Dict] = None) -> Optional[News]:
        # [Feature: News Management] [Story: NEWS-VIEW-002] [Ticket: NEWS-VIEW-002-BE-T02]
        
        news = await self.repository.get_by_id(news_id)
        
        if not news:
            return None
            
        if news.is_deleted:
            return None
            
        # Role Check Logic
        is_member = current_user is not None and current_user.get("role") in ["MEMBER", "ADMIN"]
        # Allow Admin to see everything? 
        # Ticket says: "If Article.scope == INTERNAL: Check current_user.role == MEMBER | ADMIN"
        # It doesn't explicitly mention Drafts/Status for this ticket, but logical default is to hide non-published for viewers.
        # However, if I am Admin previewing, I might want to see it.
        # But this use case is likely for the public/member view. 
        # Let's enforce PUBLISHED status for now for consistency with Feed.
        
        # Actually, let's look at the Feed logic. 
        # Feed filters by PUBLISHED. 
        # So Detail should probably too. 
        # Unless we want to allow "Preview" link for admins. 
        # For this ticket, SAFETY FIRST. Hide Drafts.
        
        is_admin = current_user is not None and current_user.get("role") == "ADMIN"
        
        if news.status != NewsStatus.PUBLISHED:
            # Maybe allow Admin to see drafts?
            if not is_admin:
                return None
        
        if news.scope == NewsScope.INTERNAL_ASOCIACION:
            # Must be MEMBER or ADMIN
            if not is_member:
                # We return a specific error or just standard Exception to be caught?
                # The Plan says "403 Forbidden".
                # Usually Use Cases return Domain Exceptions or result.
                # If we return None, it's 404. 
                # Security requires 403 to distinguish "Denied" from "Missing"? 
                # Or 404 to hide existence?
                # Ticket says "If fail: 403 Forbidden". So we must distinguish.
                raise PermissionError("Access denied to internal news")
                
        return news
