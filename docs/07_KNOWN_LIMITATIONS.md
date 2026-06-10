# Known Limitations

This document describes what Aquila DocForge MVP **does not** do yet, and where browser-based tools have inherent constraints. Use it to set expectations for yourself and your users.

---

## Browser-based PDF limitations

Direct **Export PDF** uses [html2pdf.js](https://github.com/eKoopmans/html2pdf.js), which captures the preview as an image-based PDF via html2canvas and jsPDF.

| Limitation | Impact |
|------------|--------|
| Raster output | Text may look less sharp than vector PDFs from Word or LaTeX |
| Large documents | Very long content can be slow, use more memory, or paginate imperfectly |
| Page breaks | Tables, code blocks, and headings may split awkwardly across pages |
| Links | Hyperlinks in the PDF may not remain clickable |
| Fonts | Complex scripts (Hindi, Sanskrit) depend on system fonts; glyphs may be missing in PDF on some systems |
| Colors and borders | Subtle styling may differ slightly between screen preview and PDF |

**Workaround:** Use **Print / Save PDF** for browser-native PDF generation, which often produces sharper text.

---

## CDN dependency limitation

On first load, the app fetches these libraries from jsDelivr CDN:

- markdown-it
- markdown-it-multimd-table
- html2pdf.js (includes html2canvas and jsPDF)

| Situation | What happens |
|-----------|----------------|
| No internet | Parser or PDF export may fail until libraries are cached or copied locally |
| CDN outage | Same as above |
| Corporate firewall | CDN scripts may be blocked |

**Workaround:** Copy minified files into `public/assets/vendor/` and update `<script src>` paths in `public/index.html`. See `README.md` for file names.

---

## No login yet

- Anyone with access to the HTML file can use the app.
- There are no user accounts, passwords, or roles.
- Future Phase 6+ may add optional authentication.

---

## No database yet

- Documents exist only in the browser session (the textarea).
- Refreshing or closing the tab **loses unsaved work** unless you copy the Markdown or export a PDF.
- Templates are read-only starters; edits are not persisted to a server.

---

## No cloud save yet

- No sync across devices.
- No document history or version control in the app.
- No shareable links to live documents.

**Workaround:** Save your `.md` source in files on your computer; use exported PDFs for distribution.

---

## No professional server-side PDF yet

- MVP PDF is 100% client-side.
- No headless Chrome, LaTeX, or dedicated PDF microservice (planned for Phase 7).
- Print-quality legal or print-shop workflows may need external tools.

---

## Other MVP limitations

| Area | Limitation |
|------|------------|
| Clipboard | Copy HTML may fail on `file://` URLs in some browsers |
| Images | Remote images in Markdown may not appear in PDF if blocked by CORS |
| Template sync | Editing `templates/*.md` requires regenerating `templates.js` for `file://` use |
| Accessibility | MVP has basic labels; full WCAG audit not completed |
| Dark mode | Not implemented |
| Collaboration | Single-user editor only |

---

## What the MVP *does* well

- Fast local Markdown editing with live preview
- Five professional templates
- One-click PDF download without uploading data
- Safe Markdown parsing (`html: false`)
- Works without npm, backend, or database
- Print fallback for better PDF quality when needed

---

## Future phases (not in MVP)

| Phase | Feature |
|-------|---------|
| 6 | Optional backend and saved documents |
| 7 | Professional PDF microservice |
| 8 | Deployment and hosting |

See `docs/01_PHASE_PLAN.md` for the full roadmap.
