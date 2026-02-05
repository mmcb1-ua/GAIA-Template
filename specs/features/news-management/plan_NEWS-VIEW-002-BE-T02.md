# NEWS-VIEW-002-BE-T02 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-VIEW-002-BE-T02**
**Related user story**: **NEWS-VIEW-002** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-VIEW-002-BE-T02`.

---

## 1) Context & Objective
- **Ticket summary**: Implement the API endpoint to fetch a single news article by ID. Security is paramount: if the article is `scope=INTERNAL`, access must be denied (403) to unauthenticated users or non-members.
- **Impacted entities/tables**: `news`.
- **Impacted services/modules**: `api/news`, `use_cases/get_news_detail`.
- **Impacted tests or business flows**: Viewing article details.

## 2) Scope
- **In scope**:
  - `GET /api/v1/news_articles/{id}`.
  - Authorization Logic:
    - ID not found -> 404.
    - Article Deleted -> 404 (conceptually it's gone).
    - Article Internal + User Guest -> 403.
    - Article Internal + Member -> 200.
    - Article General -> 200 (Anyone).
  - Validation: UUID format.
- **Out of scope**:
  - Incremented view count.
- **Assumptions**:
  - `current_user` available.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `backend/tests/integration/test_news_detail_security.py`
    - Test: Get General article -> 200.
    - Test: Get Internal article as Guest -> 403.
    - Test: Get Internal article as Member -> 200.
    - Test: Get Deleted article -> 404.
    - Test: Get Non-existent ID -> 404.
2.  **Implementation**:
    - Repository `get_by_id`.
    - Use Case `GetNewsDetail` (handle auth logic).
    - API Endpoint.
3.  **Refactor**: Clean separation of Auth logic.

### 3.2 NFR hooks
- **Security**: The "Internal" scope check is the primary risk here.
- **Performance**: Fetch by PK is fast.

## 4) Atomic Task Breakdown

### Task 1: Use Case with Security
- **Purpose**: Auth Logic. (Ticket: `NEWS-VIEW-002-BE-T02`)
- **Prerequisites**: DB-T01.
- **Artifacts impacted**: `backend/app/application/use_cases/news.py`.
- **Test types**: Unit.
- **BDD Acceptance**:
  - **Given** an Internal article
  - **And** a Guest user
  - **When** UseCase is called
  - **Then** PermissionError is raised.

### Task 2: API Endpoint
- **Purpose**: Exposure.
- **Artifacts impacted**: `backend/app/presentation/api/news.py`.
- **Test types**: Contract.
- **BDD Acceptance**:
  - **Given** I request an Internal article
  - **When** I am not logged in
  - **Then** I receive 403.
