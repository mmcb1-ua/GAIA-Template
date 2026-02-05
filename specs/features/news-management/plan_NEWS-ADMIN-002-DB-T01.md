# NEWS-ADMIN-002-DB-T01 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-002-DB-T01**
**Related user story**: **NEWS-ADMIN-002** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-002-DB-T01`.

---

## 1) Context & Objective
- **Ticket summary**: Optimize database for the publishing workflow. Specifically, support efficient filtering by status (DRAFT vs PUBLISHED) and scope, as these will be the primary access patterns for the "Feed" and "My Drafts" views.
- **Impacted entities/tables**: `news` table.
- **Impacted services/modules**: Database Schema (Indices).
- **Impacted tests or business flows**: Query performance for Feed and Admin Lists.

## 2) Scope
- **In scope**:
  - Add Composite Index on `(status, scope)`.
  - Add Index on `published_at` (descending order generally used).
  - Verify `published_at` is nullable (already true from previous ticket, but double check).
- **Out of scope**:
  - API endpoints implementation.
- **Assumptions**:
  - `news` table exists (Dependencies met).

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: Create a migration test that verifies the indices exist after migration.
2.  **Implementation**:
    - Generate migration: `alembic revision -m "add_news_publish_indices"`.
    - Edit migration to add `op.create_index`.
    - Apply migration.
3.  **Refactor**: None expected.

### 3.2 NFR hooks
- **Performance**: Indices allow `O(log n)` lookup instead of Table Scan for feeds.

## 4) Atomic Task Breakdown

### Task 1: Create Indices
- **Purpose**: Performance Optimization. (Ticket: `NEWS-ADMIN-002-DB-T01`)
- **Prerequisites**: DB healthy.
- **Artifacts impacted**: `backend/alembic/versions/`.
- **Test types**: Integration (Migration).
- **BDD Acceptance**:
  - **Given** the news table
  - **When** I run the migration
  - **Then** an index on `status, scope` exists.
  - **And** an index on `published_at` exists.
