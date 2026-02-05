# NEWS-ADMIN-002-FE-T03 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-002-FE-T03**
**Related user story**: **NEWS-ADMIN-002** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-002-FE-T03`.

---

## 1) Context & Objective
- **Ticket summary**: Enable administrators to publish a draft news article from the frontend. This involves adding Visual Feedback (badges) to distinct Draft from Published items, and a "Publish" action button with confirmation.
- **Impacted entities/tables**: N/A (UI).
- **Impacted services/modules**: `frontend/src/features/news-management/`, `NewsList`, `NewsEditor`.
- **Impacted tests or business flows**: Admin Publishes News.

## 2) Scope
- **In scope**:
  - Update `api/news.ts` with `publishNews(id)`.
  - Update `NewsStatusBadge` component (Visuals per Brand).
  - Add "Publish" button to `NewsEditor` (if Draft) and `NewsList` (actions menu).
  - Confirmation Modal ("Confirmar Publicación").
  - UI State update (reflect change immediately).
- **Out of scope**:
  - Scheduling (Future publish).
- **Assumptions**:
  - `NewsList` and `NewsEditor` exist or are being scaffolded. (If not, we build the pieces needed for this flow).

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `frontend/src/features/news-management/components/__tests__/PublishAction.test.tsx`
    - Test: Publish button only visible for DRAFT.
    - Test: Clicking Publish opens Confirmation.
    - Test: Confirming triggers API calls and refreshes UI.
2.  **Implementation**:
    - Add API method.
    - Create `NewsStatusBadge`.
    - Integrate Publish Button in UI.
3.  **Refactor**: standardizing Badge colors with Brand tokens (Green for Published, Gray for Draft).

### 3.2 NFR hooks
- **Brand**:
  - DRAFT Badge: `bg-muted text-muted-foreground`.
  - PUBLISHED Badge: `bg-green text-white` (Brand Green).
  - Confirmation Modal: Standard Layout.
- **UX**:
  - Toast notification on success ("Noticia publicada").
  - Optimistic UI or Loading state while publishing.

## 4) Atomic Task Breakdown

### Task 1: API & Types Update
- **Purpose**: Connect to Publish Endpoint. (Ticket: `NEWS-ADMIN-002-FE-T03`)
- **Prerequisites**: BE-T02.
- **Artifacts impacted**: `frontend/src/features/news-management/api/news.ts`.
- **Test types**: Unit.
- **BDD Acceptance**: N/A.

### Task 2: Status Badge Component
- **Purpose**: Visual distinction.
- **Artifacts impacted**: `frontend/src/features/news-management/components/NewsStatusBadge.tsx`.
- **Test types**: Visual/Component.
- **BDD Acceptance**:
  - **Given** a Published Item
  - **Then** I see a Green Badge.

### Task 3: Publish Action & Modal
- **Purpose**: Workflow trigger.
- **Artifacts impacted**: `frontend/src/features/news-management/components/PublishButton.tsx`.
- **Test types**: Component.
- **BDD Acceptance**:
  - **Given** I am editing a Draft
  - **When** I click Publish and Confirm
  - **Then** the status changes to Published on screen.
