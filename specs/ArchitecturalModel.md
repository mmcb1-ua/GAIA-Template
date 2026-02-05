# Architectural Model

This document describes the high-level architecture of the GAIA application using the C4 model.

## System Context Diagram

```mermaid
graph TD
    User[Neighborhood Resident / Admin] -- "Uses" --> GAIA[GAIA Application]
    GAIA -- "Persists Data" --> DB[(PostgreSQL Database)]
```

## Component Diagram (Backend)

The backend follows a **Hexagonal Architecture** (Ports and Adapters).

```mermaid
graph LR
    subgraph "Infrastructure (Adapters)"
        API[Presentation / FastAPI Controllers]
        RepoImpl[Infrastructure / DB Repositories]
    end

    subgraph "Application (Ports)"
        UseCase[Application / Use Cases]
    end

    subgraph "Domain"
        Entity[Domain / Models & Enums]
        RepoInterface[Domain / Repository Interfaces]
    end

    API --> UseCase
    UseCase --> RepoInterface
    RepoImpl -- "Implements" --> RepoInterface
    UseCase --> Entity
```

## Data Flow: Create News Draft
1. **Presentation**: `POST /api/v1/news_articles` receives `NewsCreate` schema.
2. **Application**: `CreateNews` use case sanitizes HTML and invokes repository.
3. **Infrastructure**: `NewsRepositoryImpl` persists the `News` entity to PostgreSQL.
