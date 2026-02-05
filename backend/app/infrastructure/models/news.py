import uuid
from datetime import datetime
import sqlalchemy as sa
from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey, Index, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.infrastructure.db.session import Base
from app.domain.enums import NewsStatus, NewsScope

class News(Base):
    __tablename__ = "news"
    __table_args__ = (
        Index("ix_news_status_scope", "status", "scope"),
        # [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-DB-T01]
        Index("ix_news_feed_composite", "is_deleted", "status", sa.text("published_at DESC")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    summary = Column(String, nullable=True)
    content = Column(Text, nullable=True)
    cover_url = Column(String, nullable=True)
    
    status = Column(SAEnum(NewsStatus), default=NewsStatus.DRAFT, nullable=False, index=True)
    scope = Column(SAEnum(NewsScope), default=NewsScope.GENERAL, nullable=False, index=True)
    
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    published_at = Column(DateTime(timezone=True), nullable=True, index=True)
    archive_at = Column(DateTime(timezone=True), nullable=True)
    
    # Audit fields
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)

    # Relationships (Assumed User model exists, if not this might fail on import if strict)
    # Relationships
    author = relationship("User", backref="news_articles")
