# NEWS-ADMIN-001-DB-T01 — Implementation Plan

**Source ticket**: `specs/features/news-management/tickets.md` → **NEWS-ADMIN-001-DB-T01**
**Related user story**: **NEWS-ADMIN-001** (from `specs/features/news-management/user-stories.md`)
**Plan version**: v1.0 — 2026-02-05
**Traceability**: All tasks must include inline references to `NEWS-ADMIN-001-DB-T01` and, where relevant, `NEWS-ADMIN-001` scenario names.

---

## 1) Context & Objective
- **Ticket summary**: Define and implement the initial database schema for the News Management module. This establishes the foundation for storing news articles with support for drafts, publishing, and access control.
- **Impacted entities/tables**: `news` (New Table).
- **Impacted services/modules**: Backend (Database Models, Alembic Migrations).
- **Impacted tests or business flows**: Foundation for "Create News Draft" (Happy Path).

## 2) Scope
- **In scope**:
  - Definition of SQLAlchemy model `News`.
  - Definition of Enums: `NewsStatus`, `NewsScope`.
  - Alembic migration script to create the table and indices.
  - Updates to `specs/DataModel.md`.
- **Out of scope**:
  - CRUD endpoints (handled in BE tickets).
  - Frontend integration.
- **Assumptions**:
  - `users` table already exists (for `author_id` FK).
- **Open questions**:
  - `docker-compose.yml` and backend structure appear to be missing. Scaffolding may be required before this ticket can be executed.

## 3) Detailed Work Plan (TDD + BDD)
> Follow **Red → Green → Refactor**.

### 3.1 Test-first sequencing
1. **Define/Update tests**
   - Create a test that attempts to insert a `news` record and verify it aligns with the schema (constraints, enums).
   - This test requires the model to be defined but the table to be created via migration (which we will run in test env).
2. **Implementation**
   - Define `News` model in `backend/app/models/news.py` (or appropriate domain module).
   - Generate Alembic migration: `alembic revision --autogenerate`.
   - Apply migration.
3. **Refactor**
   - Ensure relationships with `User` model are correctly defined (if applicable/needed for this slice).

### 3.2 NFR hooks
- **Security/Privacy**: `author_id` links to User; Ensure no PII in news content (handled by policy, technical constraint is just storage).
- **Performance**: Index on `author_id` for "My Drafts" queries.
- **Observability**: None for DB schema definition itself.

## 4) Atomic Task Breakdown

### Task 1: Define News Model & Enums
- **Purpose**: Map the business entities to code. (Ticket: `NEWS-ADMIN-001-DB-T01`)
- **Prerequisites**: `docker-compose.yml` healthy.
- **Artifacts impacted**: `backend/app/models/`, `specs/DataModel.md`.
- **Test types**: Unit (Schema verification).
- **BDD Acceptance**:
  - **Given** the database is fresh
  - **When** I inspect the schema
  - **Then** table `news` exists with columns `id`, `status` (Enum), `scope` (Enum), `author_id` (FK).

### Task 2: Generate & Apply Migration
- **Purpose**: Apply changes to the persistence layer. (Ticket: `NEWS-ADMIN-001-DB-T01`)
- **Prerequisites**: Task 1 complete.
- **Artifacts impacted**: `backend/alembic/versions/`.
- **Test types**: Integration (Migration up/down).
- **BDD Acceptance**:
  - **Given** the migration is applied
  - **When** I query the database metadata
  - **Then** the `news` table is present and writable.

### Task 3: Documentation Update
- **Purpose**: Maintain Single Source of Truth.
- **Prerequisites**: Task 2 complete.
- **Artifacts impacted**: `specs/DataModel.md`.
- **Test types**: Manual Review.
- **BDD Acceptance**: N/A (Doc update).
