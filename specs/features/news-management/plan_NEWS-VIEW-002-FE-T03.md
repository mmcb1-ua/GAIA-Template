# NEWS-VIEW-002-FE-T03 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-VIEW-002-FE-T03**
**Related user story**: **NEWS-VIEW-002** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-VIEW-002-FE-T03`.

---

## 1) Context & Objective
- **Ticket summary**: Create the Full Article Detail page. This is where users consume the content. It must adhere to security constraints (frontend controls, backend enforcement already planned) and provide a polished reading experience.
- **Impacted entities/tables**: N/A (UI).
- **Impacted services/modules**: `NewsDetailPage`, `api/news`.
- **Impacted tests or business flows**: Reading an article.

## 2) Scope
- **In scope**:
  - `NewsDetailPage`:
    - Hero Image (Cover).
    - Title, Date, Author.
    - Badges (Internal).
    - Content Body (HTML rendered safely).
    - Back Navigation.
  - Error Handling:
    - 404 -> Not Found Page.
    - 403 -> Forbidden Page (or Redirect to Login if unauth).
- **Out of scope**:
  - Comments / Likes.
- **Assumptions**:
  - Content is HTML (from Tiptap/Quill).

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `frontend/src/features/news-management/pages/__tests__/NewsDetailPage.test.tsx`
    - Test: Renders title and content.
    - Test: Shows Internal badge if scope=INTERNAL.
    - Test: Redirects/Shows error on 403.
    - Test: Sanitizes HTML content (ensure no script injection).
2.  **Implementation**:
    - `getNewsArticle` (already exists from Admin T03, reusable).
    - `NewsDetailPage` component.
3.  **Refactor**: Aesthetic polish (typography readability).

### 3.2 NFR hooks
- **Security**: DOMPurify for content rendering (XSS protection).
- **Accessibility**: Skip links, semantic `<article>` tag.
- **Brand**:
  - Typography: `Outfit` for headers, readable serif/sans for body.
  - Colors: Standard text colors.

## 4) Atomic Task Breakdown

### Task 1: Detail Page
- **Purpose**: Content Consumption. (Ticket: `NEWS-VIEW-002-FE-T03`)
- **Prerequisites**: BE-T02.
- **Artifacts impacted**: `frontend/src/features/news-management/pages/NewsDetailPage.tsx`.
- **Test types**: Component.
- **BDD Acceptance**:
  - **Given** an article
  - **When** I view the detail page
  - **Then** I see the full content.

### Task 2: Security Integration
- **Purpose**: Error Handling.
- **Artifacts impacted**: `frontend/src/features/news-management/pages/NewsDetailPage.tsx`.
- **Test types**: Component.
- **BDD Acceptance**:
  - **Given** an internal article
  - **When** I am a guest
  - **Then** I see "Access Denied".
