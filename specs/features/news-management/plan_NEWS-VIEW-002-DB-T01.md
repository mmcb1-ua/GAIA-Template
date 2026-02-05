# NEWS-VIEW-002-DB-T01 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-VIEW-002-DB-T01**
**Related user story**: **NEWS-VIEW-002** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-VIEW-002-DB-T01`.

---

## 1) Context & Objective
- **Ticket summary**: Optimize and safeguard the database queries when fetching a single news article. Specifically, ensures the `id` lookup relies on the Primary Key and that fetching the author relation does not cause N+1 issues.
- **Impacted entities/tables**: `news`.
- **Impacted services/modules**: DB Repository.
- **Impacted tests or business flows**: Loading article details.

## 2) Scope
- **In scope**:
  - Verify Primary Key index logic (Default in Postgres).
  - Verify Eager Loading (Joined Load) of Author in the Repository Query.
- **Out of scope**:
  - API changes.
- **Assumptions**:
  - `id` is PK UUID.

## 3) Detailed Work Plan (TDD + BDD)

### 3.1 Test-first sequencing
1.  **Define Tests**: `backend/tests/integration/test_news_detail_perf.py`
    - Test: Insert news with author.
    - Test: Fetch by ID.
    - Test: Access `news.author.full_name` without triggering extra queries (Assert Query Count).
2.  **Implementation**:
    - Adjust `NewsRepository.get_by_id` to use `joinedload(News.author)`.
3.  **Refactor**: None.

### 3.2 NFR hooks
- **Performance**: O(1) lookup + 1 Query total.

## 4) Atomic Task Breakdown

### Task 1: Query Optimization
- **Purpose**: Performance. (Ticket: `NEWS-VIEW-002-DB-T01`)
- **Prerequisites**: DB healthy.
- **Artifacts impacted**: `backend/app/infrastructure/repositories/news_repository_impl.py`.
- **Test types**: Integration (Performance assertion).
- **BDD Acceptance**:
  - **Given** a news article
  - **When** I fetch it by ID
  - **Then** only 1 SQL statement is executed.
