# Launch Checklist (Phase 8 — Planning Only)

> **Status:** Planning checklist only. Aquila DocForge has **not** been launched to production. Use this before any public deployment.

Copy this checklist for each launch (MVP static, backend v1, full stack with PDF).

---

## Launch metadata

| Field | Value |
|-------|-------|
| Launch name | e.g. MVP Static v1.0 |
| Target URL | `https://________________` |
| Launch date (planned) | |
| Launch owner | |
| Rollback contact | |

---

## 1. Domain

- [ ] Domain registered and owned by project owner
- [ ] DNS A/AAAA record points to correct server IP (or CNAME for static host)
- [ ] `www` redirect decided (www → apex or apex → www)
- [ ] TTL lowered before cutover (e.g. 300s) if migrating
- [ ] DNS propagation verified (`dig`, `nslookup`, or online DNS checker)
- [ ] No typosquatting on critical domain variant (optional)

---

## 2. SSL (HTTPS)

- [ ] TLS certificate installed (Let's Encrypt or provider-managed)
- [ ] Certificate covers apex + `www` (if both used)
- [ ] HTTP redirects to HTTPS (301)
- [ ] No mixed content warnings (CDN scripts load over HTTPS)
- [ ] Certificate auto-renewal configured (Certbot timer or host feature)
- [ ] SSL Labs test grade A or A- (optional but recommended): https://www.ssllabs.com/ssltest/
- [ ] HSTS header planned for production (after SSL stable) — see `10_AUTH_SECURITY_PLAN.md`

---

## 3. Error testing

- [ ] Page loads without JavaScript console errors (empty editor)
- [ ] CDN failure handled gracefully (status or preview error if offline)
- [ ] Empty PDF export shows clear error in status bar
- [ ] Empty copy HTML shows clear error
- [ ] Load Template with no selection shows clear error
- [ ] Invalid Markdown does not crash app (preview error if parser throws)
- [ ] 404 page configured on server for bad URLs (optional custom page)
- [ ] API error responses return JSON errors (future backend) — no stack traces to client

**Reference:** `docs/05_MVP_TEST_REPORT.md` (T-01 through T-21)

---

## 4. PDF testing

### Client-side PDF (MVP — html2pdf.js)

- [ ] **Load Sample** → **Export PDF** downloads file
- [ ] PDF contains headings, lists, table, blockquote, code
- [ ] Hindi and Sanskrit lines readable (OS-dependent)
- [ ] Custom PDF Name produces correct filename
- [ ] Empty export blocked with status message
- [ ] Long document multi-page export acceptable
- [ ] **Print / Save PDF** shows preview only in print dialog

### Server-side PDF (future — Phase 7)

- [ ] Export job moves `pending` → `processing` → `completed`
- [ ] Download URL works for completed export
- [ ] Failed export shows `failed` status and user message
- [ ] Each theme (Simple, Legal, Business, Report, Academic) renders correctly
- [ ] Headers, footers, page numbers visible
- [ ] Watermark appears when enabled
- [ ] Queue retry works after simulated worker crash

**Reference:** `docs/03_TESTING_CHECKLIST.md` — PDF Export Tests

---

## 5. Mobile testing

- [ ] Layout usable at ~375px width (iPhone SE class)
- [ ] Editor textarea typable on iOS Safari and Android Chrome
- [ ] Toolbar buttons tappable (min ~44px touch target)
- [ ] Panels stack vertically on narrow screens
- [ ] Preview readable without excessive horizontal scroll
- [ ] Export PDF works on mobile browser (download behavior)
- [ ] Status bar and document stats visible and readable
- [ ] Template dropdown usable on mobile

**Reference:** `docs/03_TESTING_CHECKLIST.md` — Mobile View Tests

---

## 6. Security testing

### MVP (client-only)

- [ ] `<script>alert(1)</script>` in Markdown does not execute (`html: false`)
- [ ] No API keys or secrets in `public/assets/js/`
- [ ] CDN scripts from trusted sources only (jsDelivr pinned versions)
- [ ] `Content-Security-Policy` considered for production (optional)

### Future backend

- [ ] Login rate limiting active
- [ ] Session cookies: `HttpOnly`, `Secure`, `SameSite`
- [ ] CSRF token required on mutating API calls
- [ ] User A cannot access User B's documents (IDOR test)
- [ ] Passwords stored as bcrypt/argon2 hash only
- [ ] HTTPS enforced on all routes
- [ ] PDF service not exposed publicly without API key
- [ ] Security headers configured (see `10_AUTH_SECURITY_PLAN.md`)

**Reference:** `docs/02_SECURITY_NOTES.md`, `docs/10_AUTH_SECURITY_PLAN.md`

---

## 7. Backup testing

### MVP static launch

- [ ] Latest code pushed to GitHub with release tag
- [ ] Documented redeploy steps in `15_DEPLOYMENT_PLAN.md`
- [ ] Second person can redeploy from git clone (dry run)

### Future full stack launch

- [ ] Database backup job runs successfully (check log)
- [ ] Backup file exists in off-site storage
- [ ] **Restore drill** performed on staging (see `16_BACKUP_AND_RECOVERY_PLAN.md`)
- [ ] `storage/exports/` sync to object storage verified
- [ ] `.env` stored in encrypted password manager (not in git)
- [ ] Recovery drill log entry completed

---

## 8. Performance and monitoring (recommended)

- [ ] Page load time acceptable on 3G throttled (optional)
- [ ] Large Markdown (5000+ words) preview remains usable
- [ ] Uptime monitor configured (UptimeRobot or similar)
- [ ] Server disk space alert configured (future)
- [ ] Error logging destination defined (future)

---

## 9. Documentation and legal

- [ ] `docs/06_USER_GUIDE.md` matches deployed features
- [ ] `docs/07_KNOWN_LIMITATIONS.md` linked or summarized for users
- [ ] Privacy note if server PDF stores user content (future)
- [ ] Template legal disclaimer visible where appropriate (legal-notice template)

---

## 10. Go / no-go decision

| Criterion | Go | No-go |
|-----------|-----|-------|
| All P0 items checked | ☐ | ☐ |
| Known P1 issues documented | ☐ | ☐ |
| Rollback plan defined | ☐ | ☐ |
| Owner sign-off | ☐ | ☐ |

**Rollback plan (example):** Revert DNS to previous host; redeploy previous git tag; restore DB snapshot (future).

---

## Launch sign-off

| Role | Name | Date | Signature / OK |
|------|------|------|----------------|
| Technical lead | | | |
| Product owner | | | |

---

## Post-launch (within 48 hours)

- [ ] Smoke test production URL from external network
- [ ] Monitor error logs and uptime
- [ ] Confirm first real user PDF export (or internal test)
- [ ] Record issues in `docs/05_MVP_TEST_REPORT.md` regression notes

---

*Phase 8 planning only. No production launch has occurred.*
