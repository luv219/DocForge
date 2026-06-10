# Phase Plan

This document breaks Aquila DocForge development into clear phases. Each phase builds on the previous one.

---

## Phase 0: Planning

**Goal:** Define scope, structure, and safety practices before writing application code.

**Deliverables:**
- Project folder structure
- README and planning documents
- Security and testing notes
- Placeholder `public/index.html`

**Status:** In progress / complete when all docs and folders exist.

---

## Phase 1: Static UI

**Goal:** Build the visual shell of the app with no Markdown or PDF logic yet.

**Deliverables:**
- Layout: header, editor area, preview area, export button
- Basic CSS for typography and spacing
- Responsive split-pane or stacked layout for mobile
- Placeholder text in editor and preview

**Dependencies:** None beyond HTML and CSS (vanilla JS optional for layout toggles).

---

## Phase 2: Markdown Live Preview

**Goal:** Parse Markdown and show a live formatted preview.

**Deliverables:**
- Integrate a Markdown parser (e.g. marked.js or similar)
- Wire editor input to preview output
- Sanitize HTML output to reduce XSS risk
- Support headings, lists, emphasis, links, code, blockquotes, tables

**Dependencies:** Markdown library (to be chosen and documented when installed).

---

## Phase 3: Basic PDF Export

**Goal:** Export the formatted preview as a downloadable PDF.

**Deliverables:**
- Export button triggers PDF generation from preview content
- Reasonable page layout and fonts in PDF
- Filename convention (e.g. `document-YYYY-MM-DD.pdf`)
- Error handling when export fails

**Dependencies:** Client-side PDF library (e.g. html2pdf.js, jsPDF, or similar — to be evaluated).

---

## Phase 4: Templates

**Goal:** Let users apply predefined document templates.

**Deliverables:**
- Template files in `templates/` (HTML/CSS snippets or config)
- Template picker in UI
- Preview and PDF respect selected template styles

---

## Phase 5: Testing and Polish

**Goal:** Verify quality across browsers, content types, and devices.

**Deliverables:**
- Run through `03_TESTING_CHECKLIST.md`
- Fix bugs and UI polish
- Performance checks for large documents
- Accessibility pass (keyboard, contrast, labels)

---

## Phase 6: Optional Backend and Saved Documents

**Goal:** Persist documents and support multi-device access (optional).

**Deliverables:**
- Simple API for save/load/delete documents
- Authentication (if required)
- Storage in `storage/` or database
- Migration path from client-only MVP

---

## Phase 7: Professional PDF Microservice

**Goal:** Higher-quality PDFs via a dedicated service (e.g. headless browser or LaTeX pipeline).

**Deliverables:**
- Microservice API for PDF generation
- Improved typography, margins, and multi-page handling
- Optional queue for large exports

---

## Phase 8: Deployment

**Goal:** Ship Aquila DocForge for real users.

**Deliverables:**
- Hosting choice (static host, VPS, or PaaS)
- HTTPS, environment config, and build/deploy docs
- Monitoring and backup strategy for backend (if Phase 6+)

---

## Phase Summary Table

| Phase | Name                         | Depends On   |
|-------|------------------------------|--------------|
| 0     | Planning                     | —            |
| 1     | Static UI                    | 0            |
| 2     | Markdown live preview        | 1            |
| 3     | Basic PDF export             | 2            |
| 4     | Templates                    | 3            |
| 5     | Testing and polish           | 3–4          |
| 6     | Optional backend             | 5            |
| 7     | Professional PDF microservice| 3, 6 (opt.)  |
| 8     | Deployment                   | 5+           |
