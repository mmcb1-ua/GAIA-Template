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

class NewsStatusUpdate(BaseModel):
    status: NewsStatus

class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_url: Optional[str] = None
    scope: Optional[NewsScope] = None

# [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-BE-T02]
class NewsFeedResponse(BaseModel):
    """Response schema for the news feed endpoint."""
    items: list[NewsResponse]
    total: int
    limit: int
    offset: int
