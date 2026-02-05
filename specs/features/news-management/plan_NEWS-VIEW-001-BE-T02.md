# NEWS-VIEW-001-BE-T02 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-VIEW-001-BE-T02**
**Related user story**: **NEWS-VIEW-001** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-VIEW-001-BE-T02`.

---

## 1) Context & Objective
- **Ticket summary**: Implement the API endpoint to fetch the News Feed. This endpoint serves public visitors (General news only) and authenticated members (General + Internal news).
- **Impacted entities/tables**: `news`.
- **Impacted services/modules**: `api/news`, `use_cases/list_news`.
- **Impacted tests or business flows**: Loading the main news page.

## 2) Scope
- **In scope**:
  - `GET /api/v1/news_articles`:
    - Filters: `status=PUBLISHED` (hardcoded logic, not user filterable), `is_deleted=False`.
    - Pagination: `limit`, `offset`.
    - Authorization Logic:
      - Unauthenticated / Non-Member: Return only `scope=GENERAL`.
      - Member / Admin: Return All (filtered by status).
  - Validation: Query params.
- **Out of scope**:
  - Full text search (future feature).
  - "My Drafts" filter (that's for Admin workflow, different endpoint or param).
- **Assumptions**:
  - `current_user` is available in connection scope.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `backend/tests/integration/test_news_feed.py`
    - Test: Public user sees only General news.
    - Test: Member sees Internal + General.
    - Test: Drafts are NOT shown to anyone (in this endpoint).
    - Test: Deleted items are NOT shown.
    - Test: Pagination limits results.
2.  **Implementation**:
    - Repository `list_published` method with scope filter.
    - Use Case `ListNewsFeed`.
    - API Endpoint.
3.  **Refactor**: Ensure efficient SQL generation (Composite index usage).

### 3.2 NFR hooks
- **Performance**: Must use the `(is_deleted, status, published_at)` index.
- **Security**: Data Leakage Prevention (Internal news must never go to public).
- **Observability**: Log "Feed accessed by {role}".

## 4) Atomic Task Breakdown

### Task 1: Repository Query
- **Purpose**: Data Access. (Ticket: `NEWS-VIEW-001-BE-T02`)
- **Prerequisites**: DB-T01.
- **Artifacts impacted**: `backend/app/domain/repositories/news_repository.py`.
- **Test types**: Integration.
- **BDD Acceptance**:
  - **Given** 1 General and 1 Internal article
  - **When** Repository.list is called with scope=GENERAL
  - **Then** only 1 return.

### Task 2: Use Case (Role Logic)
- **Purpose**: Business Logic.
- **Artifacts impacted**: `backend/app/application/use_cases/news.py`.
- **Test types**: Unit.
- **BDD Acceptance**:
  - **Given** a Guest user
  - **When** ListNewsFeed is executed
  - **Then** repository is called with scope=GENERAL.

### Task 3: API Endpoint
- **Purpose**: Exposure.
- **Artifacts impacted**: `backend/app/presentation/api/news.py`.
- **Test types**: Contract.
- **BDD Acceptance**:
  - **Given** I am a Member
  - **When** I GET /news_articles
  - **Then** I see internal news.
