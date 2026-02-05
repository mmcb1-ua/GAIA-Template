# Data Model

## Conceptual ER Diagram

```mermaid
erDiagram
    USERS ||--o{ NEWS : "authors"
    
    NEWS {
        uuid id PK
        string title
        string summary
        text content
        string cover_url
        enum status "DRAFT, PUBLISHED, ARCHIVED"
        enum scope "GENERAL, INTERNAL_ASOCIACION"
        uuid author_id FK
        datetime published_at
        datetime archive_at
        datetime created_at
        datetime updated_at
        boolean is_deleted
    }
```

## Entities

### News
Represents a news article or announcement.
- **id**: Unique identifier.
- **scope**: Controls visibility (General vs Internal Members).
- **status**: Publishing workflow state.
- **author_id**: Link to the User who created it.
- **is_deleted**: Soft-delete flag.
