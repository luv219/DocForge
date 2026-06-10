# Aquila DocForge — User Guide

Aquila DocForge is a free, browser-based tool that turns Markdown into a formatted document preview and exports it as a PDF. Everything runs locally in your browser — no account required for the MVP.

---

## How to open the website

1. Go to the project folder on your computer (`DocForge/`).
2. Open `public/index.html` in a modern web browser (Chrome, Edge, or Firefox recommended).
   - **Double-click** the file, or
   - Use the browser menu: **File → Open File**.
3. On first visit, an **internet connection** is needed to load parser and PDF libraries from CDN. See `07_KNOWN_LIMITATIONS.md` for offline setup.

You should see the Aquila DocForge header, toolbar, Markdown editor on the left, and preview on the right.

---

## How to write Markdown

1. Click in the **Markdown Input** panel (left side).
2. Type or paste Markdown syntax, for example:

```markdown
# My Document Title

This is a paragraph with **bold** and *italic* text.

- Bullet one
- Bullet two

1. First step
2. Second step
```

3. The **Normal Preview** panel (right side) updates automatically as you type.
4. Watch the status bar for messages and the **Words / Characters / Reading time** counts below the toolbar.

### Supported Markdown (MVP)

- Headings (`#` through `######`)
- Bold, italic, links
- Bullet and numbered lists
- Blockquotes (`>`)
- Inline code and fenced code blocks
- Tables (pipe syntax)
- Plain URLs become clickable links

Raw HTML in Markdown is **not** executed (for your safety).

---

## How to load templates

Templates give you a professional starting structure (invoice, report, meeting minutes, and more).

1. In the toolbar, open the **Template** dropdown.
2. Choose a template, for example **Invoice**.
3. Click **Load Template**.
4. If the editor already has text, you will be asked to confirm before replacing it.
5. The template appears in the editor and preview immediately.
6. Replace every `[bracketed placeholder]` with your real information.

### Available templates

| Template | Best for |
|----------|----------|
| Legal Notice | Formal notices and demands |
| Invoice | Billing and payment documents |
| Project Report | Status updates and metrics |
| Meeting Minutes | Meetings, decisions, action items |
| README Template | Software project documentation |

Template source files live in `templates/`; the app loads copies from `public/assets/js/templates.js` when opened via `file://`.

---

## How to preview

- Preview updates **live** on every keystroke (slight delay before status shows "Preview updated.").
- Use **Load Sample** for a demo document with headings, lists, table, code, Hindi, and Sanskrit.
- An empty editor shows a helpful empty-state message in the preview panel.
- If something goes wrong, errors appear in the preview panel and in the status bar.

---

## How to export PDF

**Direct export (recommended for quick downloads):**

1. Write or load content so the preview shows your document.
2. Optionally change **PDF Name** in the toolbar (`.pdf` is added automatically).
3. Click **Export PDF**.
4. Wait for the status message "PDF export completed."
5. Open the downloaded PDF from your Downloads folder.

**Tips:**

- Export uses only the preview area — not the whole browser page.
- Empty documents cannot be exported; the status bar will show an error.
- For higher-quality text, try **Print / Save PDF** instead (see below).

---

## How to print / save PDF

This uses your browser’s built-in print engine (often better for text sharpness).

1. Load or write your document.
2. Click **Print / Save PDF**.
3. In the print dialog, choose **Save as PDF** or your printer.
4. Confirm the preview shows **only the document** (no toolbar or editor).

Print layout uses A4-friendly settings defined in the app stylesheet.

---

## How to copy HTML

1. Ensure the preview shows your formatted document.
2. Click **Copy HTML**.
3. The status bar confirms success.
4. Paste into a text editor, CMS, or email that accepts HTML.

If copy fails (common on some `file://` pages), try serving the site from a local web server or use Print / Save PDF instead.

---

## Toolbar quick reference

| Button / control | Action |
|------------------|--------|
| **New** | Clear editor and preview |
| **Load Sample** | Load demo Markdown |
| **Template** + **Load Template** | Load a professional template |
| **Copy HTML** | Copy preview HTML to clipboard |
| **Print / Save PDF** | Browser print dialog |
| **Export PDF** | Download PDF via html2pdf.js |
| **PDF Name** | Filename for PDF export |

---

## Getting help

- **Known limitations:** `docs/07_KNOWN_LIMITATIONS.md`
- **Testing checklist:** `docs/03_TESTING_CHECKLIST.md`
- **Manual test report:** `docs/05_MVP_TEST_REPORT.md`

---

*Aquila DocForge MVP — local-first, no login, no cloud save.*
