# Backend Plan (Phase 6 — Planning Only)

> **Status:** Planning document only. No backend code, database, or login has been implemented.

This document outlines how Aquila DocForge could grow from a client-only MVP into a server-backed application with saved documents, user accounts, and optional professional PDF generation.

---

## Current state (MVP)

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | HTML, CSS, vanilla JS | `public/index.html`, `app.js` |
| Markdown | markdown-it (CDN) | Client-side parsing |
| PDF | html2pdf.js (CDN) | Client-side export |
| Templates | `templates/*.md` + `templates.js` | Local files only |
| Persistence | None | Content lost on refresh |

The MVP intentionally avoids servers, npm installs, and databases. Phase 6+ adds those **only after** this planning is reviewed and approved.

---

## Goals for a future backend

1. **Save and load documents** across sessions and devices
2. **Version history** for important edits
3. **Per-user isolation** — users see only their own documents
4. **Audit trail** for security-sensitive actions
5. **Optional server-side PDF** — higher quality than browser canvas (Phase 7)
6. **Template management** — admin-curated templates beyond static files
7. **Migration path** — existing MVP frontend continues to work; API added incrementally

---

## Backend option A: PHP + MySQL

### Overview

A traditional LAMP/LEMP stack: PHP handles HTTP, sessions, and CRUD; MySQL stores users, documents, and metadata.

### Pros

- Widely available on cheap shared hosting (cPanel, etc.)
- Beginner-friendly for developers coming from PHP tutorials
- Mature ecosystem for sessions, mail, and file uploads
- MySQL is familiar and well-documented

### Cons

- PDF quality still limited if done in PHP alone (libraries like Dompdf/mPDF differ from browser rendering)
- Async/queue workloads (large PDF jobs) are harder than in Node
- API-first JSON design requires discipline (avoid mixing HTML and API in same files)

### Suggested structure

```
backend/                 (future — not created yet)
├── public/
│   └── index.php        # API front controller
├── src/
│   ├── Controllers/
│   ├── Models/
│   └── Services/
├── config/
└── storage/             # aligns with existing storage/exports, temp/
```

### Best for

- Teams targeting **shared PHP hosting**
- Budget deployments with **MySQL already available**
- Incremental addition of save/load without rewriting the frontend

---

## Backend option B: Node.js + PostgreSQL (or MySQL)

### Overview

Express (or Fastify) REST API; PostgreSQL preferred for JSON columns, full-text search, and versioning; MySQL acceptable if team already uses it.

### Pros

- Same language family as future **PDF microservice** (Phase 7)
- Strong async/queue story (Bull, worker processes) for PDF jobs
- JSON APIs are natural fit for the existing JavaScript frontend
- PostgreSQL handles `document_versions` and metadata flexibly

### Cons

- Requires Node hosting (VPS, Railway, Render, etc.) — not typical shared cPanel
- More moving parts for beginners (process manager, env vars, migrations)
- MySQL on Node is fine but loses some PostgreSQL-specific advantages

### Suggested structure

```
backend/                 (future — not created yet)
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── services/
├── migrations/
├── package.json
└── .env.example
```

### Best for

- Teams comfortable with **JavaScript end-to-end**
- Plans for **Phase 7 PDF microservice** on Node
- Need for **queues, WebSockets, or real-time** features later

---

## Backend option C: Hybrid — PHP app + Node PDF microservice

### Overview

- **PHP + MySQL** (or MariaDB): authentication, document CRUD, templates, audit logs
- **Node.js microservice**: professional PDF generation (Puppeteer, Playwright, or similar)
- Frontend talks to PHP API; PHP (or frontend) calls Node PDF service internally

```
┌─────────────┐     REST      ┌──────────────┐     internal    ┌─────────────────┐
│   Browser   │ ────────────► │  PHP API     │ ──────────────► │ Node PDF service │
│  (MVP UI)   │               │  + MySQL     │                 │  (Phase 7)       │
└─────────────┘               └──────────────┘                 └─────────────────┘
```

### Pros

- **Cheap hosting** for main app (PHP) + **quality PDFs** from Node
- PDF workers can scale independently
- Main CRUD API stays simple; PDF complexity isolated
- Matches `01_PHASE_PLAN.md` Phase 6 + Phase 7 split

### Cons

- Two runtimes to deploy, monitor, and secure
- Network trust between PHP and Node (API keys, private network)
- Higher operational complexity than a single stack

### Best for

- Production deployments needing **both** easy hosting and **print-quality PDFs**
- Aquila DocForge long-term architecture (recommended path)

---

## Comparison summary

| Criterion | PHP + MySQL | Node + PostgreSQL | Hybrid (PHP + Node PDF) |
|-----------|-------------|-------------------|-------------------------|
| Hosting cost | Low | Medium | Medium |
| Beginner friendly | High | Medium | Medium |
| API + JS frontend | Good | Excellent | Good |
| PDF quality | Moderate | Good (with microservice) | Excellent |
| Operational complexity | Low | Medium | Medium–High |
| Aligns with Phase 7 | Partial | Strong | **Strongest** |

---

## Recommended approach

**Primary recommendation:** **Option C — Hybrid (PHP + MySQL for core API, Node PDF microservice in Phase 7)**

**Rationale:**

1. DocForge MVP is beginner-friendly; PHP + MySQL lowers the bar for first backend deployment.
2. Phase 7 already plans a professional PDF microservice; Node is the natural fit for headless browser PDF.
3. The current frontend is plain JS — it can call a JSON API from either PHP or Node without a framework rewrite.
4. `storage/exports/` and `storage/temp/` folders already exist for future server-side file paths.

**Alternative if the team is Node-first:** Skip PHP entirely; use **Option B** (Node + PostgreSQL) for both API and PDF worker in one monorepo with separate processes.

---

## Phased implementation order (future — not started)

| Step | Deliverable | Depends on |
|------|-------------|------------|
| 6a | Database schema + migrations plan | This doc, `09_DATABASE_SCHEMA_PLAN.md` |
| 6b | Auth design | `10_AUTH_SECURITY_PLAN.md` |
| 6c | REST API skeleton | `11_API_ENDPOINT_PLAN.md` |
| 6d | Frontend: save/load document via API | API + auth |
| 6e | Version history UI | `document_versions` table |
| 7a | Node PDF microservice | HTML snapshot or URL from API |
| 8 | Deployment, HTTPS, backups | All above |

---

## Non-goals for initial backend release

- Payment / subscription billing
- Real-time collaborative editing
- Mobile native apps
- Public document sharing without auth (unless explicitly designed later)

---

## Related documents

| Document | Topic |
|----------|-------|
| `09_DATABASE_SCHEMA_PLAN.md` | Tables and relationships |
| `10_AUTH_SECURITY_PLAN.md` | Login, sessions, CSRF |
| `11_API_ENDPOINT_PLAN.md` | REST endpoints |
| `02_SECURITY_NOTES.md` | MVP security context |
| `07_KNOWN_LIMITATIONS.md` | What MVP lacks today |

---

*Phase 6 planning only. No backend has been built.*
