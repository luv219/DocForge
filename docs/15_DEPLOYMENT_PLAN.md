# Deployment Plan (Phase 8 — Planning Only)

> **Status:** Planning document only. Nothing has been deployed. No servers, domains, or credentials have been provisioned.

This document plans how Markora PDF can be hosted for real users, from the **static MVP** (today) through a future **full stack** with backend and PDF microservice.

---

## What exists today (MVP)

| Component | Hosting need |
|-----------|----------------|
| `public/index.html`, CSS, JS | Static files only |
| CDN scripts (markdown-it, html2pdf) | Internet on first load, or vendor copies |
| Templates | Static JS + optional `.md` files |
| Database / API / PDF worker | **Not built** |

**MVP can run anywhere that serves static files** — no server-side code required.

---

## Deployment tiers

### Tier 1: Static MVP only (available now)

```text
User → HTTPS → CDN or web server → public/
```

**Suitable for:** Personal use, demos, internal tools without saved documents.

| Requirement | Notes |
|-------------|-------|
| Web server | Nginx, Apache, S3+CloudFront, GitHub Pages, Netlify, etc. |
| HTTPS | Required for clipboard API and CDN reliability |
| Build step | None (plain HTML/CSS/JS) |

---

### Tier 2: MVP + backend API (future Phase 6)

```text
User → HTTPS → Nginx → PHP or Node API + MySQL/PostgreSQL
                    → public/ (static frontend)
```

**Suitable for:** Saved documents, user accounts, template API.

---

### Tier 3: Full stack + PDF microservice (future Phase 6 + 7)

```text
User → HTTPS → Nginx
              ├── public/ (frontend)
              ├── API (PHP/Node)
              ├── MySQL/PostgreSQL
              ├── Redis (queue)
              └── PDF worker (Node + Playwright) — private port only
```

**Requires VPS or cloud VM** — not shared hosting (see below).

---

## Hosting options comparison

### GoDaddy VPS

| Aspect | Detail |
|--------|--------|
| **Type** | Managed VPS (Linux) |
| **Static MVP** | Yes — install Nginx, copy `public/` |
| **Backend + PDF** | Yes — root/sudo for Playwright dependencies |
| **Pros** | Familiar brand, cPanel optional on some plans, beginner-friendly docs |
| **Cons** | Pricing varies; performance tier-dependent; manual security patching |
| **Best for** | Teams already on GoDaddy; small production |

**Planned stack:** Ubuntu 22.04+, Nginx, PHP-FPM or Node, MySQL, Redis, PM2/systemd for PDF worker.

---

### AWS Lightsail

| Aspect | Detail |
|--------|--------|
| **Type** | Simplified cloud VPS (fixed monthly price) |
| **Static MVP** | Yes — Lightsail static IP + Nginx, or Lightsail CDN + object storage |
| **Backend + PDF** | Yes — 4 GB+ RAM instance recommended for Playwright |
| **Pros** | Predictable pricing, easy snapshots, AWS ecosystem path |
| **Cons** | Fewer regions than full EC2; still self-managed OS |
| **Best for** | Cost-conscious cloud deploy with snapshot backups |

**Recommended Lightsail size (full stack):** 4 GB RAM / 2 vCPU minimum for API + PDF worker on same VM; split workers at scale.

---

### AWS EC2

| Aspect | Detail |
|--------|--------|
| **Type** | Full cloud virtual machines |
| **Static MVP** | Yes — EC2 + Nginx, or S3 + CloudFront (cheapest static) |
| **Backend + PDF** | Yes — auto scaling groups for workers later |
| **Pros** | Maximum flexibility, IAM, ALB, RDS, ElastiCache, mature tooling |
| **Cons** | Higher learning curve; cost requires monitoring |
| **Best for** | Production scale, multi-instance PDF workers, RDS database |

**Planned architecture (future):**

- ALB → EC2 (API) + EC2 (PDF workers)
- RDS MySQL or Aurora
- ElastiCache Redis for queue
- S3 for `storage/exports/` PDF files

---

### Azure VM

| Aspect | Detail |
|--------|--------|
| **Type** | Cloud virtual machines (Linux or Windows) |
| **Static MVP** | Yes — VM + Nginx, or Azure Static Web Apps |
| **Backend + PDF** | Yes — Ubuntu VM with Playwright |
| **Pros** | Good for orgs on Microsoft stack; Azure Database for MySQL/PostgreSQL |
| **Cons** | Portal complexity; pricing calculators needed |
| **Best for** | Enterprises already using Azure AD / Microsoft 365 |

**Alternative:** Azure Static Web Apps for MVP frontend only; API on Azure App Service or VM.

---

### Hostinger VPS

| Aspect | Detail |
|--------|--------|
| **Type** | Budget VPS (Linux) |
| **Static MVP** | Yes — Nginx + `public/` |
| **Backend + PDF** | Possible on KVM VPS with 4 GB+ RAM |
| **Pros** | Low cost, simple panel, good for learning |
| **Cons** | Shared resource contention on lowest tiers; verify Playwright RAM needs |
| **Best for** | Hobby projects, staging environment, MVP + light backend |

**Caution:** Verify KVM VPS (not shared hosting) for Node/Playwright.

---

## Summary matrix

| Provider | Static MVP | Backend API | PDF microservice | Ease (beginner) | Scale |
|----------|------------|-------------|------------------|-----------------|-------|
| GoDaddy VPS | ✅ | ✅ | ✅ | Medium | Medium |
| AWS Lightsail | ✅ | ✅ | ✅ | Medium | Medium |
| AWS EC2 | ✅✅ (S3+CF) | ✅ | ✅✅ | Hard | High |
| Azure VM | ✅✅ (Static Web Apps) | ✅ | ✅ | Hard | High |
| Hostinger VPS | ✅ | ✅ | ⚠️ (RAM) | Easy | Low–Medium |
| Shared hosting (cPanel) | ✅ MVP only | ⚠️ PHP API only | ❌ | Easy | Low |

---

## Key recommendations

### 1. Static MVP can run anywhere

- **GitHub Pages**, **Netlify**, **Cloudflare Pages**, or any web host
- Copy `public/` contents; optionally vendor CDN scripts into `assets/vendor/`
- Enable HTTPS (automatic on most static hosts)

### 2. Backend + PDF microservice needs VPS or cloud VM

- Playwright/Chromium requires **~1–2 GB RAM per worker** minimum
- Redis for queue needs persistent process
- **Do not** run PDF workers on shared hosting (no Chromium, no long processes, no Redis)

### 3. Avoid shared hosting for professional PDF microservice

| Shared hosting limitation | Impact on PDF service |
|---------------------------|----------------------|
| No custom long-running Node processes | Cannot run Playwright worker |
| No Redis | No BullMQ queue |
| Restricted binaries | Chromium install blocked |
| CPU/time limits | PDF generation killed mid-job |

**Shared hosting is OK for:** Static MVP, optional PHP CRUD API (Phase 6 without server PDF).

---

## Recommended deployment path

| Stage | Hosting | Rationale |
|-------|---------|-----------|
| **Now (MVP)** | Cloudflare Pages, Netlify, or Lightsail $5 static | Free/cheap HTTPS, zero server admin |
| **Backend v1** | AWS Lightsail 2 GB or Hostinger KVM 2 GB | API + MySQL; still no PDF worker |
| **Production full stack** | **AWS Lightsail 4 GB** or **EC2 t3.medium** | API + Redis + PDF worker on one box initially |
| **Scale** | EC2 + separate worker instances + RDS + S3 | When queue depth grows |

**Primary recommendation:** **AWS Lightsail** for first production full stack — balance of simplicity, snapshots, and enough RAM for Playwright. Migrate to EC2 when autoscaling is needed.

---

## Planned server layout (single VM — future)

```text
/var/www/markora/
├── public/              # MVP frontend (git deploy)
├── backend/             # Phase 6 API (future)
├── pdf-service/         # Phase 7 worker (future)
├── storage/
│   ├── exports/
│   └── temp/
└── .env                 # NEVER commit — permissions 600

/etc/nginx/sites-available/markora
├── /        → public/
├── /api/    → PHP-FPM or Node proxy
└── (internal) PDF service — localhost:3001 only
```

---

## Environment configuration (placeholders — no real secrets)

Store in `.env` on server (not in git):

| Variable | Example placeholder | Purpose |
|----------|---------------------|---------|
| `DB_HOST` | `localhost` | Database |
| `DB_NAME` | `markora` | Database name |
| `DB_USER` | `markora_app` | DB user |
| `DB_PASSWORD` | `<generate-at-deploy>` | DB password |
| `SESSION_SECRET` | `<generate-at-deploy>` | Session signing |
| `PDF_SERVICE_API_KEY` | `<generate-at-deploy>` | Internal PDF auth |
| `REDIS_URL` | `redis://127.0.0.1:6379` | Queue |

**Never** commit `.env` or paste real values into documentation.

---

## HTTPS and domain (planned)

| Step | Action |
|------|--------|
| 1 | Register domain (e.g. `markora.example.com`) |
| 2 | Point DNS A record to server IP |
| 3 | Install Certbot (Let's Encrypt) or use host-managed SSL |
| 4 | Force HTTP → HTTPS redirect in Nginx |
| 5 | Enable HSTS after verifying SSL (see `10_AUTH_SECURITY_PLAN.md`) |

---

## CI/CD (future — not configured)

| Approach | Tool |
|----------|------|
| Static MVP | GitHub Actions → rsync/scp to server, or Pages deploy |
| Full stack | GitHub Actions → SSH deploy + `systemctl restart` |
| Database migrations | Manual or migration runner in deploy script |

---

## Monitoring (future)

| Check | Tool options |
|-------|--------------|
| Uptime | UptimeRobot, Pingdom |
| Logs | `journalctl`, Nginx access/error logs |
| Disk | Alert when `storage/exports/` > 80% |
| Queue depth | Redis `LLEN` or BullMQ dashboard |

---

## Related documents

| Document | Topic |
|----------|-------|
| `16_BACKUP_AND_RECOVERY_PLAN.md` | Backups and drills |
| `17_LAUNCH_CHECKLIST.md` | Pre-launch verification |
| `08_BACKEND_PLAN.md` | What to deploy |
| `12_PROFESSIONAL_PDF_ENGINE_PLAN.md` | PDF worker requirements |

---

*Phase 8 planning only. No deployment has occurred.*
