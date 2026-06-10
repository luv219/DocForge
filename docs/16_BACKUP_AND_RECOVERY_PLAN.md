# Backup and Recovery Plan (Phase 8 — Planning Only)

> **Status:** Planning document only. No backup jobs, credentials, or cloud storage buckets have been created.

This document defines how Markora PDF code, configuration, database, and exported PDFs should be protected **when** a production environment exists. The MVP today is local-only; most items are **future**.

---

## Backup goals

| Goal | Target |
|------|--------|
| Recover from server failure | Restore service within 4 hours (RTO) |
| Limit data loss | ≤ 24 hours of data (RPO) for documents; ≤ 1 hour for DB in production |
| Prove recoverability | Recovery drill at least **twice per year** |
| No secrets in backups repo | Encrypt backups at rest; exclude `.env` from git |

---

## 1. GitHub code backup

### Current state (MVP)

| Item | Location | Backup method |
|------|----------|---------------|
| Application source | GitHub repository | `git push` to remote |
| Documentation | `docs/` in repo | Same |
| Templates | `templates/`, `templates.js` | Same |

### Practices (now and future)

| Practice | Frequency |
|----------|-----------|
| Push all changes to GitHub | Every development session |
| Protect `main` branch | Require PR or direct push policy per team |
| Tag releases | `v1.0.0-mvp`, `v1.1.0-backend` at milestones |
| Optional mirror | Second remote (GitLab, Bitbucket) — monthly automated mirror |

### Recovery procedure

1. Clone repository: `git clone <repo-url>`
2. Checkout release tag if rolling back: `git checkout v1.0.0-mvp`
3. Redeploy `public/` to static host or full stack per `15_DEPLOYMENT_PLAN.md`

**RTO:** ~30 minutes for static MVP redeploy.

---

## 2. Database backup (future — Phase 6+)

### When implemented

MySQL or PostgreSQL on same VPS or managed service (RDS, Lightsail Database).

### Backup schedule (planned)

| Type | Frequency | Retention |
|------|-----------|-----------|
| **Automated full dump** | Daily at 02:00 UTC | 30 days |
| **Transaction/binlog** | Continuous (if supported) | 7 days |
| **Pre-migration snapshot** | Before every schema change | Until migration verified |

### Methods by environment

| Environment | Tool |
|-------------|------|
| MySQL on VPS | `mysqldump` + cron → encrypted `.sql.gz` |
| PostgreSQL on VPS | `pg_dump` + cron |
| AWS RDS | Automated backups + manual snapshot before releases |
| Lightsail Database | Instance snapshots |

### Storage destination (planned)

| Tier | Location |
|------|----------|
| Primary | Off-server object storage (S3, Backblaze B2, Wasabi) |
| Secondary | Different region or provider |
| Never | Same disk as production DB only |

### What to back up

- `users`, `documents`, `document_versions`, `templates`, `audit_logs`, `pdf_exports` metadata
- Not required in DB backup: PDF binary files (see section 3)

### Recovery procedure (future)

1. Provision new DB instance or restore snapshot
2. Import latest `mysqldump` / `pg_restore`
3. Run pending migrations if dump is behind code version
4. Verify row counts and test login + document list
5. Point application `.env` `DB_HOST` to restored instance
6. Restart API services

**RTO target:** 2–4 hours. **RPO target:** 24 hours (daily dump) or 1 hour with binlog.

---

## 3. Exported PDF backup (future — Phase 7+)

### Storage location

```text
storage/exports/{export_id}.pdf
```

Metadata in `pdf_exports` table (`09_DATABASE_SCHEMA_PLAN.md`).

### Backup schedule (planned)

| Type | Frequency | Retention |
|------|-----------|-----------|
| Filesystem sync to object storage | Daily | 90 days |
| Lifecycle rule | Auto-delete after 90 days on S3 (configurable) |

### Methods

| Setup | Approach |
|-------|----------|
| Single VPS | `rclone sync storage/exports/ s3:bucket/markora/exports/` nightly |
| EC2 + S3 | Write PDFs directly to S3; versioning enabled |
| Lightsail | Periodic snapshot of block storage + export sync |

### Recovery procedure (future)

1. Restore `pdf_exports` rows from DB backup
2. Restore files from S3/`rclone` to `storage/exports/`
3. Verify `storage_path` in DB matches files on disk
4. Test download endpoint for sample `export_id`

**Note:** PDFs are regeneratable from Markdown if `document_id` and content exist — PDF backup is convenience, not sole source of truth.

---

## 4. Config backup

### What counts as config

| Item | Backup method | In git? |
|------|---------------|---------|
| Nginx site config | Copy to `deploy/nginx/` in private repo or config management | Template only — no secrets |
| systemd unit files | Same | Template only |
| `.env` production values | **Encrypted** backup (see below) | **Never** |
| SSL certificates | Let's Encrypt auto-renew; backup `/etc/letsencrypt` optionally | N/A |
| Redis config | Document in `deploy/redis.conf` template | Template only |

### `.env` backup (future)

| Rule | Detail |
|------|--------|
| Never commit | `.gitignore` includes `.env` |
| Encrypted store | Password manager (1Password, Bitwarden) or SOPS-encrypted file in private bucket |
| Access | Admin only; rotate after personnel change |
| Restore | Decrypt to server `.env` with `chmod 600` |

### Config recovery procedure

1. Redeploy Nginx/systemd templates from git
2. Restore `.env` from encrypted store
3. Reload services: `nginx -t && systemctl reload nginx`
4. Verify health endpoints

---

## 5. Recovery drill

### Purpose

Prove backups work before an emergency. Document results in this file's drill log (below).

### Drill schedule

| Drill | Frequency | Owner |
|-------|-----------|-------|
| Static MVP redeploy from git | Quarterly | Developer |
| Full DB restore to staging | Twice per year | Admin |
| PDF export folder restore | Annually | Admin |
| Complete server rebuild | Annually | Admin |

### Drill steps (full stack — future)

1. **Announce** drill window (staging or isolated environment)
2. **Simulate failure** — stop DB or delete staging `storage/exports/` sample
3. **Restore** from latest backup
4. **Verify:**
   - [ ] User can log in
   - [ ] Documents list loads
   - [ ] Single document open/edit works
   - [ ] PDF export completes
   - [ ] PDF download works
5. **Record** time to recover (actual RTO)
6. **Fix** any gaps in backup scripts or documentation

### Drill log (fill in when performed)

| Date | Drill type | Result | RTO achieved | Issues found |
|------|------------|--------|--------------|--------------|
| | | | | |

---

## Disaster scenarios

| Scenario | Primary recovery | Data loss (expected) |
|----------|------------------|----------------------|
| Accidental `git` force push | Reflog / GitHub support / mirror | Minimal if caught quickly |
| VPS disk failure | Restore from provider snapshot + DB dump | ≤ 24h without binlog |
| Ransomware on server | Rebuild VM from scratch; restore from off-site backups | ≤ RPO per backup tier |
| Deleted single document | Soft-delete restore from DB or `document_versions` | None if versions kept |
| Region outage (cloud) | Failover to second region (future) | Depends on replication |

---

## Backup security

- Encrypt backups at rest (S3 SSE, `gpg` on dumps)
- Restrict bucket IAM to backup user only
- No production passwords in backup filenames or logs
- Test restores use **anonymized** copy of production data when possible

---

## MVP today (minimal backup)

| Asset | Action now |
|-------|------------|
| Code | Push to GitHub regularly |
| User documents | None stored server-side — user responsibility to save `.md` / PDF locally |
| Config | N/A |

---

## Related documents

| Document | Topic |
|----------|-------|
| `15_DEPLOYMENT_PLAN.md` | Where backups live |
| `17_LAUNCH_CHECKLIST.md` | Backup testing before launch |
| `09_DATABASE_SCHEMA_PLAN.md` | Tables to dump |

---

*Phase 8 planning only. No backup systems are configured.*
