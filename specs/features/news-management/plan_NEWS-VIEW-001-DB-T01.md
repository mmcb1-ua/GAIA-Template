# NEWS-VIEW-001-DB-T01 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-VIEW-001-DB-T01**
**Related user story**: **NEWS-VIEW-001** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-VIEW-001-DB-T01`.

---

## 1) Context & Objective
- **Ticket summary**: Optimize the database for the efficient retrieval of news feeds (e.g., Public Feed, Member Feed). These queries will filter by status (PUBLISHED), scope, and soft-delete state, ordered by `published_at DESC`.
- **Impacted entities/tables**: `news`.
- **Impacted services/modules**: DB Schema (Indices).
- **Impacted tests or business flows**: Feed Latency.

## 2) Scope
- **In scope**:
  - Add Composite Index on `(is_deleted, status, published_at DESC)`.
  - Validate this covers the most common access pattern: `WHERE is_deleted=False AND status='PUBLISHED' [AND scope=...] ORDER BY published_at DESC`.
- **Out of scope**:
  - API changes.
- **Assumptions**:
  - `is_deleted` and `status` columns exist.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: Migration verification (Index existence).
2.  **Implementation**:
    - `alembic revision -m "add_news_feed_indices"`.
    - `op.create_index`.
3.  **Refactor**: None.

### 3.2 NFR hooks
- **Performance**: High Query TPS expected on feeds; Index matches "The Perfect Index" pattern (Equality, Range, Sort).

## 4) Atomic Task Breakdown

### Task 1: Create Feed Index
- **Purpose**: Optimize Read Path. (Ticket: `NEWS-VIEW-001-DB-T01`)
- **Prerequisites**: DB healthy.
- **Artifacts impacted**: `backend/alembic/versions`.
- **Test types**: Integration.
- **BDD Acceptance**:
  - **Given** the news table
  - **When** I apply the migration
  - **Then** a composite index `(is_deleted, status, published_at)` exists.
