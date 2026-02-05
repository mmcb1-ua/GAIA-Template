# NEWS-VIEW-001-FE-T03 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-VIEW-001-FE-T03**
**Related user story**: **NEWS-VIEW-001** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-VIEW-001-FE-T03`.

---

## 1) Context & Objective
- **Ticket summary**: Implement the public-facing News Feed page. This page displays a grid/list of news articles, allowing visitors and members to browse the latest news.
- **Impacted entities/tables**: N/A (UI).
- **Impacted services/modules**: `frontend/src/features/news-management/`, `NewsCard`, `NewsFeedPage`.
- **Impacted tests or business flows**: Visitor views news.

## 2) Scope
- **In scope**:
  - `NewsFeedPage`: Main container.
  - `NewsCard` component: Displays Cover, Title, Date, Summary.
  - API Client: `getNewsFeed` (fetches from `GET /api/v1/news_articles`).
  - Layout: Grid (responsive).
  - Pagination: "Load More" button or simple pagination.
  - Empty State: "No hay noticias publicadas".
- **Out of scope**:
  - Complex search/filtering (Future).
- **Assumptions**:
  - `shadcn/ui` Card components available.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `frontend/src/features/news-management/pages/__tests__/NewsFeedPage.test.tsx`
    - Test: Renders list of articles.
    - Test: Handles loading state.
    - Test: Handles empty state.
    - Test: Clicking a card goes to detail (if detail route exists, else stub).
2.  **Implementation**:
    - API client.
    - `NewsCard` Item.
    - `NewsFeed` Grid.
3.  **Refactor**: Responsive design (mobile vs desktop columns).

### 3.2 NFR hooks
- **Brand**:
  - Card: `Warm White` background, `TerracottaAA` title hover.
  - Typography: `Outfit` for headings.
  - Spacing: Standard grid gap.
- **Performance**:
  - Images: Use `loading="lazy"`.
  - Pagination: Fetch 12 items per page.

## 4) Atomic Task Breakdown

### Task 1: API Client
- **Purpose**: Fetch public feed. (Ticket: `NEWS-VIEW-001-FE-T03`)
- **Prerequisites**: BE-T02.
- **Artifacts impacted**: `frontend/src/features/news-management/api/news.ts`.
- **Test types**: Unit.
- **BDD Acceptance**: N/A.

### Task 2: News Card Component
- **Purpose**: Individual Item Display.
- **Artifacts impacted**: `frontend/src/features/news-management/components/NewsCard.tsx`.
- **Test types**: Component.
- **BDD Acceptance**:
  - **Given** an article with cover image
  - **Then** the image is rendered with aspect ratio.

### Task 3: Feed Page & Grid
- **Purpose**: Main Page.
- **Artifacts impacted**: `frontend/src/features/news-management/pages/NewsFeedPage.tsx`.
- **Test types**: Component.
- **BDD Acceptance**:
  - **Given** 10 published articles
  - **Then** I see 10 cards in the grid.
