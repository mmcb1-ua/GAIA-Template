# NEWS-ADMIN-003-FE-T03 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-003-FE-T03**
**Related user story**: **NEWS-ADMIN-003** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-003-FE-T03`.

---

## 1) Context & Objective
- **Ticket summary**: Enable administrators to Edit existing news articles (reusing the form from Create) and Delete them (with a critical confirmation dialog).
- **Impacted entities/tables**: N/A (UI).
- **Impacted services/modules**: `NewsEditor`, `NewsList`, `api/news`.
- **Impacted tests or business flows**: Admin Edits; Admin Deletes.

## 2) Scope
- **In scope**:
  - `EditNewsPage`: Fetches data by ID and populates `NewsForm`.
  - Updates to `NewsForm` to handle "Edit Mode" (mostly pre-filling values).
  - Delete Action in `NewsList`: Triggers `DELETE` API + Refresh list.
  - Delete Confirmation Dialog (Red/Destructive).
  - API methods: `getNewsArticle`, `updateNewsArticle`, `deleteNewsArticle`.
- **Out of scope**:
  - Bulk actions.
- **Assumptions**:
  - `NewsForm` built in T03 (Create) is reusable.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `frontend/src/features/news-management/pages/__tests__/EditNewsPage.test.tsx`
    - Test: Fetches article on mount.
    - Test: Populates form fields.
    - Test: Submits PUT request on save.
    - Test: Delete button shows confirmation.
2.  **Implementation**:
    - Add API methods.
    - Create `EditNewsPage`.
    - Add Delete logic to List.
3.  **Refactor**: Ensure "Loading" state handles the fetch delay gracefully.

### 3.2 NFR hooks
- **Brand**:
  - Destructive Action (Delete): `variant="destructive"` (Red).
  - Confirmation Modal: Clear warning about consequences (though it's soft delete, user assumes it's gone).
- **UX**:
  - If 404 on Edit -> Redirect to List with error toast.
  - Success Toast on Update/Delete.

## 4) Atomic Task Breakdown

### Task 1: API Methods
- **Purpose**: Data Access. (Ticket: `NEWS-ADMIN-003-FE-T03`)
- **Prerequisites**: BE-T02.
- **Artifacts impacted**: `frontend/src/features/news-management/api/news.ts`.
- **Test types**: Unit.
- **BDD Acceptance**: N/A.

### Task 2: Edit Page & Form Reuse
- **Purpose**: Modification UI.
- **Artifacts impacted**: `frontend/src/features/news-management/pages/EditNewsPage.tsx`, `NewsForm.tsx`.
- **Test types**: Component.
- **BDD Acceptance**:
  - **Given** an existing article
  - **When** I open Edit Page
  - **Then** the Title field contains the existing title.

### Task 3: Delete Action
- **Purpose**: Removal UI.
- **Artifacts impacted**: `frontend/src/features/news-management/components/NewsList.tsx`.
- **Test types**: Component.
- **BDD Acceptance**:
  - **Given** a list of news
  - **When** I click Delete -> Confirm
  - **Then** the item disappears from the list.
