# User Stories: News Management

## 1. Introduction
This document defines the user stories for the **News Management** feature.
**Goal:** Establish the app as the official communication channel (`single source of truth`), ensuring timely dissemination of information (`< 10 min` from draft to publish) and proper access control between public and internal news.

---

## 2. User Stories

### Story 1: Create News Draft (Administrator)
**ID:** `NEWS-ADMIN-001`
**As an** Administrator
**I want to** create a news article as a draft including title, summary, content, and visibility scope
**So that** I can prepare announcements before they go live.

**Acceptance Criteria:**
- **Scenario 1: Happy Path - Create Internal Draft**
  - **Given** I am logged in as an Administrator
  - **When** I define a new article with:
    - Title: "Annual Assembly"
    - Scope: `INTERNAL_ASOCIACION`
    - Content: "Details..."
  - **Then** the system saves it with status `DRAFT`
  - **And** it is visible in my "My Drafts" or Admin list
  - **And** it is NOT visible to Members yet.

- **Scenario 2: Validation Failure**
  - **Given** I try to save an article without a Title
  - **Then** the system prevents saving and shows a "Title is required" error.

- **Scenario 3: Security (XSS)**
  - **Given** I paste HTML content with `<script>alert('hack')</script>` in the body
  - **Then** the backend sanitizes the input before saving
  - **And** no script is executed when viewing the draft.

---

### Story 2: Publish News (Administrator)
**ID:** `NEWS-ADMIN-002`
**As an** Administrator
**I want to** publish a draft news article
**So that** it becomes visible to the target audience immediately.

**Acceptance Criteria:**
- **Scenario 1: Happy Path - Publish**
  - **Given** I have an existing draft "Festivities 2026"
  - **When** I change status to `PUBLISHED`
  - **Then** the `published_at` timestamp is set to now
  - **And** the article appears in the public list (if scope is `GENERAL`).

- **Scenario 2: Publish Internal News**
  - **Given** I have a draft with scope `INTERNAL_ASOCIACION`
  - **When** I publish it
  - **Then** only logged-in Members can see it in their feed.

---

### Story 3: Manage News - Edit & Delete (Administrator)
**ID:** `NEWS-ADMIN-003`
**As an** Administrator
**I want to** edit or delete existing news
**So that** I can correct mistakes or remove outdated information.

**Acceptance Criteria:**
- **Scenario 1: Edit Published Article**
  - **Given** a published article exists
  - **When** I update the content and save
  - **Then** the changes are reflected immediately for users.

- **Scenario 2: Soft Delete**
  - **Given** an article "Old Event" exists
  - **When** I delete it
  - **Then** it is marked as `is_deleted=true` in the database
  - **And** it no longer appears in any public/member lists.

---

### Story 4: View News List (Member / Public)
**ID:** `NEWS-VIEW-001`
**As a** Member or Visitor
**I want to** see a list of relevant news ordered by date (newest first)
**So that** I can catch up with the latest association updates.

**Acceptance Criteria:**
- **Scenario 1: Visitor View (Public)**
  - **Given** I am an unauthenticated Visitor
  - **When** I visit the News section
  - **Then** I see only articles with scope `GENERAL`
  - **And** I do NOT see `INTERNAL_ASOCIACION` articles.

- **Scenario 2: Member View**
  - **Given** I am logged in as a Member
  - **When** I visit the News section
  - **Then** I see **both** `GENERAL` and `INTERNAL` articles
  - **And** internal articles are visually prohibited/distinguished (optional UI hint).

- **Scenario 3: Pagination & Sorting**
  - **Given** there are 50 news items
  - **When** I request the list
  - **Then** I see the first 10 items sorted by `published_at` DESC
  - **And** I can load more/next page within `< 500ms` (NFR compliance).

---

### Story 5: Read News Detail (Member / Public)
**ID:** `NEWS-VIEW-002`
**As a** Member or Visitor
**I want to** click on a news item to read the full content
**So that** I can get all the details.

**Acceptance Criteria:**
- **Scenario 1: Read General News**
  - **Given** a general news item exists
  - **When** I click on it
  - **Then** the full content, cover image, and attachments are displayed.

- **Scenario 2: Security - Access Control Failure**
  - **Given** a malicious user tries to access an `INTERNAL` news ID via direct URL `GET /api/news/{internal_id}`
  - **And** they are NOT logged in
  - **Then** the system returns `403 Forbidden` or `404 Not Found`.

---
