# PDF Template Style Guide (Phase 7 — Planning Only)

> **Status:** Planning document only. No theme CSS files or PDF microservice exist yet.

This guide defines **five PDF themes** for the professional Playwright export pipeline. Each theme is a CSS bundle + optional header/footer fragments applied when wrapping user HTML (see `12_PROFESSIONAL_PDF_ENGINE_PLAN.md`).

Themes are selected via export request: `{ "theme": "business" }`.

---

## Shared foundations (all themes)

### Typography baseline

| Element | Default |
|---------|---------|
| Body font | `Georgia`, `Times New Roman`, serif OR `system-ui` for Simple |
| Monospace | `Consolas`, `Courier New` |
| Devanagari | `Noto Sans Devanagari`, `Nirmala UI`, `Mangal` (bundled on server) |
| Body size | 11pt |
| Line height | 1.55 |
| Color | `#1a1d23` on `#ffffff` |

### Markdown element rules (all themes)

- Headings: clear hierarchy (h1 largest, h6 smallest)
- Tables: full width, collapsed borders, header row distinct
- Blockquotes: left border + muted background
- Code: monospace, light gray background; pre blocks avoid awkward splits (`page-break-inside: avoid`)
- Links: underline; print color dark gray (not blue-only)
- Images: max-width 100%; optional page-break-inside avoid

### `@page` default

```css
@page {
  size: A4 portrait;
  margin: 20mm 15mm 25mm 15mm;
}
```

---

## Theme 1: Simple

**Slug:** `simple`  
**Best for:** General notes, quick exports, personal documents

### Visual character

- Clean, minimal, maximum readability
- Sans-serif body (`system-ui`, `Segoe UI`)
- No decorative rules except subtle heading underlines
- White background only

### Header / footer

| Slot | Content |
|------|---------|
| Header | Optional document title (right-aligned), small gray text |
| Footer | Page numbers only |
| Watermark | None by default |

### Color palette

| Token | Value |
|-------|-------|
| Text | `#1f2937` |
| Muted | `#6b7280` |
| Border | `#e5e7eb` |
| Accent | `#2563eb` (links only) |

### Distinctive CSS notes (planned)

```css
.pdf-theme-simple h1 {
  font-size: 22pt;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.25em;
}
.pdf-theme-simple h2 { font-size: 16pt; }
```

---

## Theme 2: Legal

**Slug:** `legal`  
**Best for:** Legal notices, contracts, formal letters (pairs with `templates/legal-notice.md`)

### Visual character

- Traditional serif (`Times New Roman`, `Georgia`)
- Justified body text optional
- Numbered sections feel formal
- Strong top border on h1

### Header / footer

| Slot | Content |
|------|---------|
| Header | Reference number (left), date (right) |
| Footer | Page numbers + "Privileged and Confidential" line |
| Watermark | `CONFIDENTIAL` optional |

### Color palette

| Token | Value |
|-------|-------|
| Text | `#111111` |
| Muted | `#444444` |
| Border | `#333333` |
| Accent | `#000000` |

### Distinctive CSS notes (planned)

```css
.pdf-theme-legal {
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
}
.pdf-theme-legal h1 {
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.pdf-theme-legal blockquote {
  border-left: 3px solid #333;
  font-style: italic;
}
```

---

## Theme 3: Business

**Slug:** `business`  
**Best for:** Invoices, proposals, meeting minutes, corporate reports

### Visual character

- Modern sans-serif (`Segoe UI`, `Helvetica Neue`)
- Brand accent color stripe on h1 or header bar
- Tables with shaded header row (matches MVP preview tables)
- Professional spacing

### Header / footer

| Slot | Content |
|------|---------|
| Header | Company name + logo placeholder (left), document type (right) |
| Footer | Page numbers + company website or email |
| Watermark | `DRAFT` for unpublished exports |

### Color palette

| Token | Value |
|-------|-------|
| Text | `#1a1d23` |
| Primary | `#2563eb` |
| Table header bg | `#f8f9fb` |
| Border | `#d8dce3` |

### Distinctive CSS notes (planned)

```css
.pdf-theme-business h1 {
  color: #2563eb;
  font-size: 20pt;
  border-bottom: 3px solid #2563eb;
}
.pdf-theme-business th {
  background: #f8f9fb;
  font-weight: 600;
}
```

**Default theme** for server export when none specified.

---

## Theme 4: Report

**Slug:** `report`  
**Best for:** Project reports, status updates, metrics (pairs with `templates/project-report.md`)

### Visual character

- Clear section numbering (1.0, 2.0 style via CSS counters optional)
- Executive summary in shaded box
- KPI tables with alternating rows
- Slightly denser layout than Business

### Header / footer

| Slot | Content |
|------|---------|
| Header | Report title + reporting period |
| Footer | Page numbers + "Internal Use" |
| Watermark | Optional department name |

### Color palette

| Token | Value |
|-------|-------|
| Text | `#1e293b` |
| Section accent | `#0f766e` (teal) |
| Summary box bg | `#f0fdfa` |
| Border | `#cbd5e1` |

### Distinctive CSS notes (planned)

```css
.pdf-theme-report .executive-summary {
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  padding: 1em;
  margin-bottom: 1.5em;
}
.pdf-theme-report h2 {
  color: #0f766e;
  border-bottom: 1px solid #cbd5e1;
}
```

---

## Theme 5: Academic

**Slug:** `academic`  
**Best for:** Essays, research summaries, README-style documentation, assignments

### Visual character

- Serif body (`Georgia`, `Times`)
- Generous margins (wider side margins via `@page`)
- Double-spaced body option (config flag)
- Citations and blockquotes styled for academic tone
- h1 centered title page style for first heading

### Header / footer

| Slot | Content |
|------|---------|
| Header | Author name (left), course/paper title (right) — from metadata |
| Footer | Page numbers centered |
| Watermark | None default |

### Color palette

| Token | Value |
|-------|-------|
| Text | `#000000` |
| Muted | `#374151` |
| Border | `#9ca3af` |

### Distinctive CSS notes (planned)

```css
@page {
  margin: 25mm 20mm 25mm 20mm;  /* wider academic margins */
}
.pdf-theme-academic {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 2;  /* when double_spaced: true */
}
.pdf-theme-academic h1:first-child {
  text-align: center;
  font-size: 18pt;
  margin-bottom: 2em;
}
```

---

## Theme selection matrix

| Document type | Recommended theme | MVP template file |
|---------------|-------------------|-------------------|
| Quick export | Simple | — |
| Legal notice | Legal | `legal-notice.md` |
| Invoice | Business | `invoice.md` |
| Project report | Report | `project-report.md` |
| Meeting minutes | Business | `meeting-minutes.md` |
| README / essay | Academic | `readme-template.md` |

---

## Theme file structure (future)

```
pdf-service/src/themes/
├── simple.css
├── legal.css
├── business.css
├── report.css
├── academic.css
├── _base.css          # shared Markdown element rules
└── headers/
    ├── business-header.html
    └── ...
```

---

## Request API mapping (planned)

```json
{
  "theme": "business",
  "options": {
    "double_spaced": false,
    "watermark": { "text": "DRAFT", "enabled": true },
    "metadata": {
      "company_name": "Acme Corp",
      "author": "Jane Doe",
      "reference": "INV-2026-001"
    }
  }
}
```

---

## Accessibility & fonts

- Embed or install **Noto Sans Devanagari** on PDF worker for Hindi/Sanskrit
- Minimum 9pt for footer text; 11pt body
- Sufficient contrast (WCAG AA) for all theme text/background pairs

---

## Related documents

| Document | Topic |
|----------|-------|
| `12_PROFESSIONAL_PDF_ENGINE_PLAN.md` | Playwright pipeline |
| `14_PDF_EXPORT_QUEUE_PLAN.md` | Export jobs |
| `templates/*.md` | Source Markdown templates |

---

*Phase 7 planning only. No PDF themes have been implemented.*
