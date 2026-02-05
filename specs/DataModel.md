# Data Model

## Conceptual ER Diagram

```mermaid
erDiagram
    USERS ||--o{ NEWS : "authors"
    
    USERS {
        uuid id PK
        string email
        string full_name
        boolean is_active
        boolean is_admin
    }

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

### User
Represents an application user (Neighbor/Board Member).
- **id**: Unique identifier.
- **email**: Contact and login identifier.
- **is_admin**: Whether the user has administrative privileges.
