# NEWS-ADMIN-003-DB-T01 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-003-DB-T01**
**Related user story**: **NEWS-ADMIN-003** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-003-DB-T01`.

---

## 1) Context & Objective
- **Ticket summary**: Ensure the database infrastructure supports "Soft Delete". This means valid records have `is_deleted=False` and deleted ones have `is_deleted=True`. Queries should default to active records.
- **Impacted entities/tables**: `news`.
- **Impacted services/modules**: Database Schema.
- **Impacted tests or business flows**: Deleting a news item (it should persist but be hidden).

## 2) Scope
- **In scope**:
  - Verification of `is_deleted` index (already defined in model).
  - Creation of a "Soft Delete verification" test to ensure infrastructure behaves as expected.
- **Out of scope**:
  - API Endpoints (BE ticket).
- **Assumptions**:
  - `is_deleted` column exists (from `NEWS-ADMIN-001-DB-T01`).

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `backend/tests/integration/test_news_soft_delete_db.py`
    - Test: Insert active item.
    - Test: Insert deleted item.
    - Test: Query all -> receive both (at DB level).
    - Test: Query where is_deleted=False -> receive only active.
2.  **Implementation**:
    - If index is missing (unlikely), add it. If present, just verify.
    - No migration needed if T01 covered it. (We will verify this).
3.  **Refactor**: None.

### 3.2 NFR hooks
- **Data Integrity**: Deletions are reversible.
- **Performance**: Index on `is_deleted` ensures we don't scan trash.

## 4) Atomic Task Breakdown

### Task 1: Soft Delete Verification
- **Purpose**: Infra verification. (Ticket: `NEWS-ADMIN-003-DB-T01`)
- **Prerequisites**: DB healthy.
- **Artifacts impacted**: `backend/tests/integration/test_news_soft_delete_db.py`.
- **Test types**: Integration.
- **BDD Acceptance**:
  - **Given** a deleted news item
  - **When** I query where `is_deleted` is False
  - **Then** the item is NOT returned.
