# NEWS-ADMIN-002-BE-T02 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-002-BE-T02**
**Related user story**: **NEWS-ADMIN-002** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-002-BE-T02`.

---

## 1) Context & Objective
- **Ticket summary**: Implement the logic and endpoint to transition a news article from `DRAFT` to `PUBLISHED` status. This action triggers the setting of the `published_at` timestamp.
- **Impacted entities/tables**: `news` (status, published_at fields).
- **Impacted services/modules**: Domain Models, Use Cases, API Router.
- **Impacted tests or business flows**: Admin publishes a news draft.

## 2) Scope
- **In scope**:
  - Endpoint `PATCH /api/v1/news_articles/{id}/status`.
  - Input Schema: `NewsStatusUpdate` (only status field).
  - Business Logic:
    - Allow DRAFT -> PUBLISHED.
    - On Publish, set `published_at = now()`.
    - RBAC: Admin only.
  - Tests: State transition verification.
- **Out of scope**:
  - Complex state machines (e.g., Review workflows) - simple toggle for now.
  - Notifications (Email/Push) on publish.
- **Assumptions**:
  - `NewsRepository` update method exists or will be added.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `backend/tests/integration/test_news_publish.py`
    - Test: Admin publishes draft -> Status=PUBLISHED, published_at is set.
    - Test: Non-admin attempts publish -> 403.
    - Test: Invalid transition (if any restrictions added, e.g. Archived -> Draft).
2.  **Implementation**:
    - Update `NewsRepository` with `update` method.
    - Create `PublishNews` use case.
    - Add endpoint to Router.
3.  **Refactor**: Ensure timestamp precision is handled correctly.

### 3.2 NFR hooks
- **Security**: RBAC (Admin-only) is critical here as it exposes data to the public feed.
- **Data Integrity**: `published_at` must be immutable once set? (For now, re-publishing updates it, or we ignore if already published. Plan: Update it if transitioning to PUBLISHED).

## 4) Atomic Task Breakdown

### Task 1: Repository Update Support
- **Purpose**: Persistence layer update. (Ticket: `NEWS-ADMIN-002-BE-T02`)
- **Prerequisites**: DB-T01 complete.
- **Artifacts impacted**: `backend/app/domain/repositories/news_repository.py`, `backend/app/infrastructure/repositories/news_repository_impl.py`.
- **Test types**: Integration.
- **BDD Acceptance**:
  - **Given** an existing news item
  - **When** Repository.update is called
  - **Then** the fields are updated in DB.

### Task 2: Publish Use Case
- **Purpose**: Domain logic (Side effects like timestamp).
- **Artifacts impacted**: `backend/app/application/use_cases/publish_news.py`.
- **Test types**: Unit.
- **BDD Acceptance**:
  - **Given** a draft news item
  - **When** I publish it
  - **Then** status is PUBLISHED and published_at is set.

### Task 3: API Endpoint
- **Purpose**: Expose logic.
- **Artifacts impacted**: `backend/app/presentation/api/news.py`, `backend/app/presentation/schemas/news.py`.
- **Test types**: Contract.
- **BDD Acceptance**:
  - **Given** I am an Admin
  - **When** I PATCH status to PUBLISHED
  - **Then** I receive the updated resource with timestamp.
