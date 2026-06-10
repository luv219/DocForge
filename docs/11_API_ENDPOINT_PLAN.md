# API Endpoint Plan (Phase 6 — Planning Only)

> **Status:** Planning document only. No API routes, server, or endpoints are implemented.

This document plans the REST-style JSON API for Markora PDF backend. Base URL examples assume:

```text
https://api.example.com/v1
```

or for same-origin PHP:

```text
https://example.com/api/v1
```

---

## Conventions

| Topic | Plan |
|-------|------|
| Format | JSON request/response bodies |
| Auth | Session cookie (`markora_session`) after login |
| CSRF | `X-CSRF-Token` header on mutating requests |
| IDs | UUID strings in paths |
| Errors | `{ "error": { "code": "...", "message": "..." } }` |
| Timestamps | ISO 8601 UTC |
| Versioning | `/v1` prefix |

### Standard HTTP status codes

| Code | Use |
|------|-----|
| 200 | Success with body |
| 201 | Created |
| 204 | Success, no body (delete) |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Authenticated but forbidden |
| 404 | Resource not found (including other user's doc) |
| 409 | Conflict (e.g. stale version) |
| 429 | Rate limited |
| 500 | Server error |

---

## Authentication endpoints (future)

Not part of document CRUD but required before API use.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Start session |
| POST | `/auth/logout` | End session |
| GET | `/auth/me` | Current user profile |
| GET | `/auth/csrf` | Return CSRF token for SPA |
| POST | `/auth/forgot-password` | Request reset email (future) |
| POST | `/auth/reset-password` | Complete reset (future) |

---

## Document endpoints (planned)

### Create document

```http
POST /api/v1/documents
Content-Type: application/json
X-CSRF-Token: <token>

{
  "title": "My Invoice",
  "markdown_content": "# Invoice\n\n...",
  "template_id": "uuid-or-null"
}
```

**Response `201`:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My Invoice",
  "markdown_content": "# Invoice\n\n...",
  "template_id": null,
  "current_version": 1,
  "word_count": 42,
  "char_count": 256,
  "created_at": "2026-06-10T12:00:00Z",
  "updated_at": "2026-06-10T12:00:00Z"
}
```

**Side effects:** Insert `documents` row; insert `document_versions` v1; audit `document.create`.

---

### Update document

```http
PUT /api/v1/documents/{document_id}
Content-Type: application/json
X-CSRF-Token: <token>

{
  "title": "Updated title",
  "markdown_content": "# Updated\n\n...",
  "expected_version": 3
}
```

**Response `200`:** Updated document object with `current_version: 4`.

**Rules:**

- Verify `user_id` owns document
- Optional optimistic locking via `expected_version` → `409` if mismatch
- Append new `document_versions` row on each save
- Recompute `word_count`, `char_count`

**Side effects:** audit `document.update`.

---

### List documents

```http
GET /api/v1/documents?page=1&limit=20&sort=updated_at&order=desc
```

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "My Invoice",
      "word_count": 42,
      "updated_at": "2026-06-10T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "total_pages": 1
  }
}
```

**Rules:** Only non-deleted documents for authenticated user; no `markdown_content` in list view (performance).

---

### Get document

```http
GET /api/v1/documents/{document_id}
```

**Response `200`:** Full document including `markdown_content`.

**Rules:** 404 if not found or not owned by user.

**Optional query:** `?include=versions` — last N version summaries.

---

### Delete document

```http
DELETE /api/v1/documents/{document_id}
X-CSRF-Token: <token>
```

**Response `204`:** No body.

**Rules:** Soft delete (`deleted_at = NOW()`); audit `document.delete`.

**Future:** `POST /documents/{id}/restore` for undelete within retention window.

---

## PDF export endpoint (planned)

### Export PDF (server-side — Phase 7 integration)

```http
POST /api/v1/pdf/export
Content-Type: application/json
X-CSRF-Token: <token>

{
  "document_id": "uuid-or-null",
  "markdown_content": "# Optional inline if no document_id",
  "filename": "my-document",
  "method": "server"
}
```

**Response `202` (async job):**

```json
{
  "export_id": "uuid",
  "status": "pending",
  "poll_url": "/api/v1/pdf/exports/uuid"
}
```

**Poll `GET /api/v1/pdf/exports/{export_id}`:**

```json
{
  "id": "uuid",
  "status": "completed",
  "filename": "my-document.pdf",
  "download_url": "/api/v1/pdf/exports/uuid/download",
  "file_size_bytes": 125000,
  "completed_at": "2026-06-10T12:05:00Z"
}
```

**Rules:**

- `method: "client"` — not a server endpoint; remains in browser (current MVP)
- `method: "server"` — queue job to Node PDF microservice (Phase 7)
- Store record in `pdf_exports`; file in `storage/exports/`
- Rate limit per user
- Audit `pdf.export`

**Download:**

```http
GET /api/v1/pdf/exports/{export_id}/download
```

Returns `application/pdf` stream; auth required; owner only.

---

## Template endpoints (planned)

### List templates

```http
GET /api/v1/templates
```

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "invoice",
      "name": "Invoice",
      "description": "Billing template with line items",
      "category": "business"
    }
  ]
}
```

**Rules:** Public to authenticated users; only `is_active = true`; no full `markdown_content` in list (optional `?include=content`).

---

### Get template (optional v1)

```http
GET /api/v1/templates/{slug}
```

**Response `200`:**

```json
{
  "id": "uuid",
  "slug": "invoice",
  "name": "Invoice",
  "markdown_content": "# Invoice\n\n...",
  "updated_at": "2026-06-10T00:00:00Z"
}
```

**Frontend migration:** Replace `MARKORA_TEMPLATES` JS load with API call when online; keep JS fallback offline.

---

### Admin: create/update template (future)

| Method | Path | Role |
|--------|------|------|
| POST | `/api/v1/admin/templates` | admin |
| PUT | `/api/v1/admin/templates/{id}` | admin |
| DELETE | `/api/v1/admin/templates/{id}` | admin |

Not required for backend v1 user release.

---

## Version history endpoints (optional v1.1)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/documents/{id}/versions` | List version summaries |
| GET | `/api/v1/documents/{id}/versions/{n}` | Get specific version body |
| POST | `/api/v1/documents/{id}/versions/{n}/restore` | Restore as new current version |

---

## Endpoint summary table

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/documents` | Yes | Create document |
| PUT | `/api/v1/documents/{id}` | Yes | Update document |
| GET | `/api/v1/documents` | Yes | List documents |
| GET | `/api/v1/documents/{id}` | Yes | Get document |
| DELETE | `/api/v1/documents/{id}` | Yes | Delete document |
| POST | `/api/v1/pdf/export` | Yes | Server PDF export |
| GET | `/api/v1/pdf/exports/{id}` | Yes | Export status |
| GET | `/api/v1/pdf/exports/{id}/download` | Yes | Download PDF |
| GET | `/api/v1/templates` | Yes* | List templates |
| GET | `/api/v1/templates/{slug}` | Yes* | Get template content |

\* Templates could be public read-only; auth recommended for rate limiting and audit.

---

## Frontend integration plan (future)

1. Add `api.js` module with `fetch` wrappers and CSRF handling
2. "Save document" button calls `POST` or `PUT`
3. Document picker UI calls `GET /documents`
4. Keep local-only mode when API unavailable (feature detection)
5. PDF: try server export if logged in; fallback to client `html2pdf.js`

---

## Related documents

| Document | Topic |
|----------|-------|
| `08_BACKEND_PLAN.md` | PHP vs Node vs hybrid |
| `09_DATABASE_SCHEMA_PLAN.md` | Tables behind endpoints |
| `10_AUTH_SECURITY_PLAN.md` | Sessions, CSRF |
| `07_KNOWN_LIMITATIONS.md` | Current MVP gaps |

---

*Phase 6 planning only. No API has been implemented.*
