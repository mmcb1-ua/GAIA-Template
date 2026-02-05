# NEWS-ADMIN-001-FE-T03 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-001-FE-T03**
**Related user story**: **NEWS-ADMIN-001** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-001-FE-T03` and `NEWS-ADMIN-001` (Create Draft).

---

## 1) Context & Objective
- **Ticket summary**: Create the "Create News" page in the Admin Dashboard. This includes a form with fields for title, summary, scope (dropdown), content (rich text), and cover URL. It calls the backend endpoint to save as DRAFT.
- **Impacted entities/tables**: None direct (UI only), uses `News` DTOs.
- **Impacted services/modules**: `frontend/src/features/news-management/`, `api/news`, `router`.
- **Impacted tests or business flows**: Admin creates a news draft successfully.

## 2) Scope
- **In scope**:
  - React Page Component: `pages/CreateNewsPage.tsx`.
  - Form Component: `components/NewsForm.tsx` (Reusable for Edit later).
  - Validation: Zod schema (Title required, Scope enum).
  - Rich Text Editor: Integration (e.g., Tiptap or ReactQuill) properly styled.
  - API Client: `createNewsArticle` function.
  - Route Registration: `/admin/news/create`.
- **Out of scope**:
  - Image Upload (User inputs URL string for now).
  - Publishing logic (Status is Draft by default).
- **Assumptions**:
  - Admin Layout already exists (will slot into it).
  - `shadcn/ui` components (Input, Button, Select, Textarea) are available.
  - `react-hook-form` and `zod` are installed.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `frontend/src/features/news-management/components/__tests__/NewsForm.test.tsx`
    - Test: Renders all fields.
    - Test: Validation error when Title is empty.
    - Test: Submits correct payload to mock API.
2.  **Implementation**:
    - Create API helper `createNews`.
    - Create Zod Schema.
    - Implement `NewsForm` with `react-hook-form`.
    - Create Page wrapper.
3.  **Refactor**: Ensure Button styles (TerracottaAA) match Brand Guidelines.

### 3.2 NFR hooks
- **Accessibility**: Form labels must be standard. ARIA invalid states for errors.
- **Brand**: Use `TerracottaAA` for Primary Button ("Guardar Borrador"). Use `Warm White` for card background.
- **Connectivity**: On success, redirect to News List (`/admin/news`).
- **Performance**: Lazy load Rich Text Editor if heavy.

## 4) Atomic Task Breakdown

### Task 1: API Client & Types
- **Purpose**: Bridge FE to BE. (Ticket: `NEWS-ADMIN-001-FE-T03`)
- **Prerequisites**: BE logic planned/stubbed.
- **Artifacts impacted**: `frontend/src/features/news-management/api/news.ts`, `frontend/src/features/news-management/types.ts`.
- **Test types**: Unit (Type check).
- **BDD Acceptance**: N/A (code foundation).

### Task 2: News Form Component (Logic & Validation)
- **Purpose**: Input handling.
- **Artifacts impacted**: `frontend/src/features/news-management/components/NewsForm.tsx`, `schema.ts`.
- **Test types**: Component Test (Vitest/RTL).
- **BDD Acceptance**:
  - **Given** I am on the form
  - **When** I leave Title empty and submit
  - **Then** I see "Title is required" error.

### Task 3: Rich Text Editor Integration
- **Purpose**: Content editing.
- **Artifacts impacted**: `frontend/src/components/ui/RichTextEditor.tsx` (Shared) or local.
- **Test types**: Manual/Component.
- **BDD Acceptance**:
  - **Given** I type bold text
  - **Then** the value corresponds to HTML/Markdown.

### Task 4: Page Assembly & Routing
- **Purpose**: Navigation Integration.
- **Artifacts impacted**: `frontend/src/features/news-management/pages/CreateNewsPage.tsx`, `frontend/src/app/router/admin-routes.tsx`.
- **Test types**: Manual / E2E (Navigation).
- **BDD Acceptance**:
  - **Given** I am on Admin Dashboard
  - **When** I click "Create News"
  - **Then** I land on `/admin/news/create`.
