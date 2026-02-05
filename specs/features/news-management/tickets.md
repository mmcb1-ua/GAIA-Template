# News Management — Implementation Tickets

**Feature**: News Management
**Slug**: `news-management`
**Dependencies**: User Management (for Auth & RBAC).

---

### Story: NEWS-ADMIN-001 — Create News Draft (Administrator)
**Source**: `user-stories.md`
**Key Scenarios**: Happy Path (Internal Draft), Validation Failure, Security (XSS).

#### Tickets for NEWS-ADMIN-001

1. - [x] **NEWS-ADMIN-001-DB-T01 — Create News Table & Enums** (`2026-02-05`)
   - **Type**: DB
   - **Description**: Design and migrate the database schema for news articles.
     - Table: `news`
     - Columns: `id` (UUID), `title`, `summary`, `content` (Text), `cover_url`, `published_at`, `created_at`, `updated_at`, `archive_at`, `is_deleted`.
     - Enums: `NewsStatus` (DRAFT, PUBLISHED, ARCHIVED), `NewsScope` (GENERAL, INTERNAL_ASOCIACION).
     - Keys: PK `id`, FK `author_id` -> `users.id`.
   - **Scope**: CREATE TABLE, Indices (author_id).
   - **Dependencies**: None.
   - **Deliverables**: Alembic transaction, Updated Models.

2. - [x] **NEWS-ADMIN-001-BE-T02 — Create Draft Endpoint** (`2026-02-05`)
   - **Type**: BE
   - **Description**: Implement `POST /api/v1/news_articles` to create a news entry.
     - Default status: `DRAFT`.
     - RBAC: `ADMIN` only.
     - Input Sanitization: Bleach/HTML-Sanitizer for `content` field to prevent XSS.
     - Validation: Title required, Scope required.
   - **Scope**: Endpoint, Pydantic Schemas (Create/Response), Service Logic, Unit Tests.
   - **Dependencies**: T01 (DB).
   - **Deliverables**: Python Code, Pytest (Happy path + XSS prevention).

3. - [x] **NEWS-ADMIN-001-FE-T03 — News Editor Form (Create)** (`2026-02-05`)
   - **Type**: FE
   - **Description**: Admin UI to create a new article.
     - Fields: Title, Summary, Scope (Dropdown), Content (Rich Text Editor - Tiptap/Quill), Cover Image URL.
     - Integration: Call `POST /api/v1/news_articles`.
   - **Scope**: Form Component, Validation (Zod), Admin Layout integration.
   - **Dependencies**: T02 (BE).
   - **Deliverables**: React Component, Component Test.

---

### Story: NEWS-ADMIN-002 — Publish News (Administrator)
**Source**: `user-stories.md`
**Key Scenarios**: Happy Path (Publish), Publish Internal News.

#### Tickets for NEWS-ADMIN-002

4. - [x] **NEWS-ADMIN-002-DB-T01 — Indexing for Publishing Workflow** (`2026-02-05`)
   - **Type**: DB
   - **Description**: Ensure efficient querying for published/draft items.
     - Add Index on `(status, scope)`.
     - Ensure `published_at` is nullable and indexed for time-based sorting.
   - **Scope**: Migration/Index creation if not in base table.
   - **Dependencies**: NEWS-ADMIN-001-DB-T01.
   - **Deliverables**: Alembic Migration (if needed) or verification test.

5. - [x] (2026-02-05) **NEWS-ADMIN-002-BE-T02** — Publish Status Transition Endpoint
    - **Status**: COMPLETED
   - **Type**: BE
   - **Description**: Implement `PATCH /api/v1/news_articles/{id}/status`.
     - Transition: DRAFT -> PUBLISHED.
     - Logic: Set `published_at` = NOW() on transition.
     - RBAC: `ADMIN` only.
   - **Scope**: Endpoint, State Machine Logic.
   - **Dependencies**: DB-T01.
   - **Deliverables**: Endpoint, Tests (State transition checks).

6. - [x] **NEWS-ADMIN-002-FE-T03 — Publish Action & Status UI** (`2026-02-05`)
   - **Type**: FE
   - **Description**: Add "Publish" button in the Admin list or Editor.
     - Visual Feedback: Show status badges (DRAFT vs PUBLISHED).
     - Confirmation Modal: "Are you sure you want to make this live?".
   - **Scope**: UI Actions, API Integration.
   - **Dependencies**: BE-T02.
   - **Deliverables**: React Component updates.

---

### Story: NEWS-ADMIN-003 — Manage News - Edit & Delete (Administrator)
**Source**: `user-stories.md`
**Key Scenarios**: Edit Published Article, Soft Delete.

#### Tickets for NEWS-ADMIN-003

7. - [x] **NEWS-ADMIN-003-DB-T01 — Soft Delete Support** (`2026-02-05`)
   - **Type**: DB
   - **Description**: Ensure `is_deleted` column infrastructure is sound.
     - Verify queries filter `is_deleted=False` by default.
   - **Scope**: Query Logic / Index on `is_deleted`.
   - **Dependencies**: NEWS-ADMIN-001-DB-T01.
   - **Deliverables**: DB verification test.

8. - [x] **NEWS-ADMIN-003-BE-T02 — Edit and Delete Endpoints** (`2026-02-05`)
   - **Type**: BE
   - **Description**:
     - `PUT /api/v1/news_articles/{id}`: Full update of validation fields.
     - `DELETE /api/v1/news_articles/{id}`: Soft delete action.
     - RBAC: `ADMIN` only.
   - **Scope**: Endpoints, Logic.
   - **Dependencies**: DB-T01.
   - **Deliverables**: Endpoints, Pytest coverage.

9. - [ ] **NEWS-ADMIN-003-FE-T03 — Edit/Delete UI**
   - **Type**: FE
   - **Description**:
     - Edit: Pre-fill Editor form with existing data (fetch by ID).
     - Delete: Delete button with critical confirmation (Red warning).
   - **Scope**: Form reuse, Management List Actions.
   - **Dependencies**: BE-T02.
   - **Deliverables**: UI Logic, Zod Validation reuse.

---

### Story: NEWS-VIEW-001 — View News List (Member / Public)
**Source**: `user-stories.md`
**Key Scenarios**: Visitor View, Member View, Pagination.

#### Tickets for NEWS-VIEW-001

10. - [ ] **NEWS-VIEW-001-DB-T01 — List Query Optimization**
    - **Type**: DB
    - **Description**: Optimize "Feed" queries.
      - Composite Index: `(is_deleted, status, published_at DESC)`.
    - **Scope**: Performance tuning.
    - **Dependencies**: Previous DB tickets.
    - **Deliverables**: Migration/Index.

11. - [ ] **NEWS-VIEW-001-BE-T02 — Public & Member Feed Endpoint**
    - **Type**: BE
    - **Description**: `GET /api/v1/news_articles`.
      - Filters: `status=PUBLISHED` (forced).
      - Scope Logic:
        - If User=Unauth/Supporter -> Filter `scope=GENERAL`.
        - If User=Member -> Show All (mark internal?).
      - Pagination: `limit`, `offset`.
    - **Scope**: Endpoint, Complex Query Building (SQLAlchemy).
    - **Dependencies**: DB-T01.
    - **Deliverables**: Endpoint, Tests (Role-based data leak checks).

12. - [ ] **NEWS-VIEW-001-FE-T03 — News Feed UI**
    - **Type**: FE
    - **Description**: Public-facing news list.
      - Component: `NewsCard` (Image, Title, Date, Summary).
      - Layout: Grid/List view.
      - Logic: Fetch next page (Infinite scroll or Load More).
      - Empty State: "No news yet".
    - **Scope**: UI Page/Components.
    - **Dependencies**: BE-T02.
    - **Deliverables**: React Layout.

---

### Story: NEWS-VIEW-002 — Read News Detail (Member / Public)
**Source**: `user-stories.md`
**Key Scenarios**: Read General News, Security Access Control.

#### Tickets for NEWS-VIEW-002

13. - [ ] **NEWS-VIEW-002-DB-T01 — Detail Fetch Optimization**
    - **Type**: DB
    - **Description**: Ensure simple ID lookup is optimal (Primary Key).
      - Verify no N+1 queries if author info is fetched.
    - **Scope**: Query verification.
    - **Dependencies**: None.
    - **Deliverables**: Query analysis (comment/test).

14. - [ ] **NEWS-VIEW-002-BE-T02 — Get Detail Endpoint with Security**
    - **Type**: BE
    - **Description**: `GET /api/v1/news_articles/{id}`.
      - **CRITICAL SECURITY**:
        - If Article.scope == INTERNAL:
          - Check `current_user.role == MEMBER | ADMIN`.
          - If fail: 403 Forbidden.
    - **Scope**: Permission Logic, Endpoint.
    - **Dependencies**: DB-T01.
    - **Deliverables**: Endpoint, Security Tests (Negative testing).

15. - [ ] **NEWS-VIEW-002-FE-T03 — Article Detail Page**
    - **Type**: FE
    - **Description**: Full page view of the article.
      - Render Cover Image (Hero).
      - Render HTML Content (Sanitized container).
      - "Internal" Badge for internal news.
      - Back button to Feed.
      - Error handling (403/404).
    - **Scope**: UI Page.
    - **Dependencies**: BE-T02.
    - **Deliverables**: Page Component.
