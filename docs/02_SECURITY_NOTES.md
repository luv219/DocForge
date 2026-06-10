# Security Notes

Security considerations for Markora PDF, from MVP through future phases.

---

## Markdown XSS Risk

**Risk:** Markdown parsers often allow inline HTML. Malicious content such as `<script>` tags or `onerror` handlers in images can execute in the browser if output is inserted unsafely.

**Mitigations (planned):**
- Sanitize HTML after Markdown conversion (e.g. DOMPurify or a parser with safe mode)
- Never use `innerHTML` with unsanitized user input
- Prefer `textContent` for plain text paths
- Disable or strip raw HTML in Markdown if not required for MVP
- Keep dependencies updated and review CVE advisories

---

## Raw HTML Risk

**Risk:** Users (or pasted content) may include raw HTML blocks, iframes, or external resources that leak data or load untrusted content.

**Mitigations (planned):**
- Allowlist safe tags only (p, h1–h6, ul, ol, li, strong, em, code, pre, blockquote, table elements, a with href only)
- Strip `javascript:` URLs and event attributes (`onclick`, etc.)
- Do not render arbitrary iframes or embeds in MVP
- Document that Markora PDF is for trusted personal content, not arbitrary untrusted uploads

---

## PDF Export Privacy Risk

**Risk:** Client-side PDF generation keeps data on the user’s machine (good for privacy). If we later send HTML to a server for PDF generation, document content transits the network and may be logged on the server.

**Mitigations (planned):**
- MVP: generate PDF entirely in the browser when possible
- Future server PDF: use HTTPS, minimal retention, clear privacy policy
- Do not log full document bodies in production
- Optional “local only” mode that never calls external APIs

---

## Future Login Security

**Risk:** When Phase 6 adds accounts, weak passwords, session fixation, and credential leaks become concerns.

**Mitigations (planned):**
- Use established auth libraries or OAuth providers; do not roll custom crypto
- Hash passwords with bcrypt/argon2; never store plain text
- HTTP-only, Secure, SameSite cookies for sessions
- Rate limiting on login and password reset
- CSRF protection on state-changing requests

---

## Future Document Storage Security

**Risk:** Saved documents may contain sensitive personal or business information. Unauthorized access or IDOR (insecure direct object reference) could expose them.

**Mitigations (planned):**
- Enforce per-user authorization on every document read/write/delete
- Use unpredictable document IDs (UUIDs)
- Encrypt data at rest if storing on shared infrastructure
- Regular backups with access controls
- Audit logging for admin access
- Clear data retention and deletion policy for users

---

## General Practices

- No secrets in client-side JavaScript
- Validate and sanitize all server inputs in backend phases
- Follow principle of least privilege for file system access (`storage/` only where needed)
- Review `02_SECURITY_NOTES.md` before each phase that touches user content or auth
