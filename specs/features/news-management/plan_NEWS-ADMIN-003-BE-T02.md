# NEWS-ADMIN-003-BE-T02 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-003-BE-T02**
**Related user story**: **NEWS-ADMIN-003** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-003-BE-T02`.

---

## 1) Context & Objective
- **Ticket summary**: Provide API endpoints for Administrators to Edit (full update) and Delete (soft delete) news articles.
- **Impacted entities/tables**: `news`.
- **Impacted services/modules**: `api/news`, `use_cases/update_news`, `use_cases/delete_news`.
- **Impacted tests or business flows**: Admin modifies an article; Admin deletes an article.

## 2) Scope
- **In scope**:
  - `PUT /api/v1/news_articles/{id}`: Update inputs (title, content, etc.).
  - `DELETE /api/v1/news_articles/{id}`: Soft delete (set `is_deleted=True`).
  - RBAC: Admin only.
  - Validation: Same as Create (XSS sanitization, etc.).
- **Out of scope**:
  - Hard delete (GDPR "Right to be Forgotten" usually handled separately).
- **Assumptions**:
  - Logic for "Update" should usually reset `status` to DRAFT? -> *Decision*: No, if it's published, we might want to keep it published but edit a typo. We will allow editing without changing status. Status change is a separate endpoint (T02).
  - *Self-correction*: The ticket says "Full update of validation fields". `status` and `scope` might be in the payload. Let's allow editing them if sent, or separate them. Given we have a specific "Publish" endpoint, usually `PUT` updates content. Let's keep `status` controllable via `PATCH /status` for state transitions, but if `PUT` sends `status`, we might reject it or accept it. *Decision*: To keep it simple and safe, `PUT` updates content fields (title, summary, content, cover, scope). Status transitions are via PATCH.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `backend/tests/integration/test_news_edit_delete.py`
    - Test: Admin updates title -> Success.
    - Test: Admin deletes -> `is_deleted` becomes True.
    - Test: Deleted item -> GET returns 404 (needs verification in Repository logic).
    - Test: XSS Sanitization works on Update.
2.  **Implementation**:
    - Repository `update` (already exists from Publish ticket?) and `delete` methods.
    - Use Cases: `UpdateNews`, `DeleteNews`.
    - API Endpoints.
3.  **Refactor**: Shared validation logic between Create and Update.

### 3.2 NFR hooks
- **Security**:
  - **RBAC**: Admin only.
  - **Input Sanitization**: Must re-sanitize content on edit.
- **Observability**: Log "News Article {id} deleted by User {uid}".

## 4) Atomic Task Breakdown

### Task 1: Repository Support
- **Purpose**: Persistence. (Ticket: `NEWS-ADMIN-003-BE-T02`)
- **Prerequisites**: BE-T02 (Publish) might have added `update`.
- **Artifacts impacted**: `backend/app/domain/repositories/news_repository.py`.
- **Test types**: Integration.
- **BDD Acceptance**:
  - **Given** an article
  - **When** Repository.delete is called
  - **Then** is_deleted is True.

### Task 2: Use Cases (Update & Delete)
- **Purpose**: Domain Logic.
- **Artifacts impacted**: `backend/app/application/use_cases/news.py`.
- **Test types**: Unit.
- **BDD Acceptance**:
  - **Given** a malicious script in content
  - **When** UpdateUseCase is called
  - **Then** the script is sanitized.

### Task 3: API Endpoints
- **Purpose**: HTTP Interface.
- **Artifacts impacted**: `backend/app/presentation/api/news.py`.
- **Test types**: Contract.
- **BDD Acceptance**:
  - **Given** I am Admin
  - **When** I DELETE /{id}
  - **Then** I get 204 No Content.
