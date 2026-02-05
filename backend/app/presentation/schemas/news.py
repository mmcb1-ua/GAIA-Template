from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.domain.enums import NewsStatus, NewsScope

class NewsCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_url: Optional[str] = None
    scope: NewsScope = NewsScope.GENERAL

class NewsResponse(BaseModel):
    id: UUID
    title: str
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_url: Optional[str] = None
    status: NewsStatus
    scope: NewsScope
    author_id: UUID
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
