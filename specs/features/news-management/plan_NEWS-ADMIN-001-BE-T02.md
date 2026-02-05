# NEWS-ADMIN-001-BE-T02 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-001-BE-T02**
**Related user story**: **NEWS-ADMIN-001** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-001-BE-T02`.

---

## 1) Context & Objective
- **Ticket summary**: Implement the backend logic to create a news article draft. This exposes the `POST /api/v1/news_articles` endpoint restricted to Administrators.
- **Impacted entities/tables**: `news`.
- **Impacted services/modules**: Domain Models, Repository, Service/UseCase, API Router.
- **Impacted tests or business flows**: Create News Draft (Happy Path), Validation Constraints.

## 2) Scope
- **In scope**:
  - Pydantic DTOs for Create Request and Response.
  - Endpoint `POST /api/v1/news_articles` with RBAC (Admin only).
  - Business Logic: Default status=DRAFT, sanitize content (XSS protection).
  - Unit/Integration tests for the endpoint.
- **Out of scope**:
  - Frontend implementation.
  - Publishing workflow (PATCH status).
- **Assumptions**:
  - `bleach` or similar library is used for sanitization.
  - Auth middleware exists (mocking it for now if missing).

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `backend/tests/integration/test_news_create.py`:
    - Test happy path (Admin creates draft).
    - Test validation (Missing title).
    - Test security (XSS stripping).
    - Test Access (Non-admin rejected).
2.  **Implementation**:
    - Add `bleach` to `requirements.txt`.
    - Create `NewsCreate` and `NewsResponse` schemas.
    - Implement `NewsRepository.create`.
    - Implement `CreateNews` use case (sanitization + repo call).
    - Implement Router.
3.  **Refactor**: Ensure clean separation of concerns.

### 3.2 NFR hooks
- **Security**: 
  - Input Sanitization (Content).
  - RBAC (Admin required).
- **Performance**: Async DB operations.

## 4) Atomic Task Breakdown

### Task 1: Scaffolding & Dependencies
- **Purpose**: Prepare environment.
- **Prerequisites**: Docker running (or local env healthy).
- **Artifacts impacted**: `backend/requirements.txt`, `backend/app/domain/`, `backend/app/presentation/schemas/`.
- **Test types**: Build check.
- **BDD Acceptance**: n/a.

### Task 2: Domain & Repository Layer
- **Purpose**: Define Repository Interface and Implementation for Insert.
- **Artifacts impacted**: `backend/app/domain/repositories/news_repository.py`, `backend/app/infrastructure/repositories/news_repository_impl.py`.
- **Test types**: Integration (DB).
- **BDD Acceptance**:
  - **Given** valid news data
  - **When** Repository.create is called
  - **Then** a record persists in DB.

### Task 3: Use Case & Sanitization
- **Purpose**: Business logic.
- **Artifacts impacted**: `backend/app/application/use_cases/create_news.py`.
- **Test types**: Unit.
- **BDD Acceptance**:
  - **Given** content with `<script>` tags
  - **When** UseCase executes
  - **Then** the script tags are removed from the saved content.

### Task 4: API Endpoint
- **Purpose**: Expose via HTTP.
- **Artifacts impacted**: `backend/app/presentation/api/news.py`, `backend/app/main.py`.
- **Test types**: contract/E2E.
- **BDD Acceptance**:
  - **Given** I am an Admin
  - **When** I POST to `/api/v1/news_articles`
  - **Then** I get 201 Created and the created resource.
