# Aquila DocForge

## Purpose

Aquila DocForge is a beginner-friendly web tool that converts Markdown text into a clean, readable preview and exports that preview as a PDF file. It is designed for writers, students, and professionals who want a simple way to turn Markdown notes into polished documents without complex setup.

## MVP Features

- Split-pane editor with Markdown input on one side and live formatted preview on the other
- Support for common Markdown syntax (headings, lists, bold, italic, links, code blocks, tables)
- One-click PDF export of the formatted preview
- Responsive layout that works on desktop and mobile browsers
- No login or account required for the MVP

## Future Features

- Document templates (resume, report, letter, invoice)
- Saved documents and version history (with optional backend)
- Hindi and Sanskrit text support with proper font rendering
- Custom branding (logo, header, footer)
- Professional PDF generation via a dedicated microservice
- User accounts and secure document storage
- Dark mode and accessibility improvements
- Batch export and sharing links

## Phase 1 Completed Features

- Full static layout: header, toolbar, two-column editor, and footer
- Markdown input textarea (`#markdownInput`) and preview panel (`#previewOutput`)
- Toolbar buttons wired with Phase 1 placeholder behavior:
  - **New** — clears the editor and preview
  - **Load Sample** — inserts sample Markdown text (no live conversion yet)
  - **Copy HTML** — shows Phase 2 placeholder alert
  - **Print / Save PDF** — opens the browser print dialog
  - **Export PDF** — shows Phase 3 placeholder alert
- Responsive CSS: two columns on desktop, stacked on mobile
- Document-style preview panel and table styles ready for Phase 2 output
- Print stylesheet hides editor chrome and prints the preview area only

## Files Added (Phase 1)

| File | Purpose |
|------|---------|
| `public/assets/css/app.css` | Layout, toolbar, editor, preview, and print styles |
| `public/assets/js/app.js` | Toolbar button handlers (Phase 1 placeholders) |

## How to Open the Project Locally

No build tools or dependencies are required. Plain HTML, CSS, and JavaScript only.

1. Open the project folder: `DocForge/` (repository root)
2. Open `public/index.html` in your web browser (double-click the file or use **File → Open**)
3. You should see the Aquila DocForge editor UI with toolbar and two panels

## How to Test the UI (Phase 1)

1. **Layout** — Confirm header, toolbar, Markdown panel, preview panel, and footer are visible.
2. **New** — Type text in the textarea, click **New**; both panels should clear.
3. **Load Sample** — Click **Load Sample**; sample Markdown appears in the left panel only (preview unchanged).
4. **Copy HTML** — Click **Copy HTML**; alert says Phase 2.
5. **Print / Save PDF** — Click the button; browser print dialog opens. Choose a printer or "Save as PDF".
6. **Export PDF** — Click **Export PDF**; alert says Phase 3.
7. **Responsive** — Resize the window below 768px width; panels should stack vertically.
8. **Print preview** — Use Print preview in the browser; toolbar, textarea, header, and footer should be hidden.

## Phase 2 Completed Features

- **Live Markdown preview** — typing in the editor updates `#previewOutput` on every keystroke
- **markdown-it parser** (CDN) with safe settings:
  - `html: false` — raw HTML in Markdown is not executed
  - `linkify: true` — plain URLs become clickable links
  - `typographer: true` — typographic punctuation improvements
- **GFM tables** via `markdown-it-multimd-table` (CDN) for pipe-style tables
- **Copy HTML** — copies rendered preview HTML to the clipboard with success/error alerts
- **Load Sample** — inserts full sample document and renders preview immediately
- **Sample content** includes heading, paragraph, bold, bullet list, numbered list, table, blockquote, code block, Hindi, and Sanskrit lines
- **Preview CSS** for headings, paragraphs, lists, blockquotes, code, tables, and Devanagari-friendly fonts
- **Error handling** — parser load failures and render errors show a clear message in the preview panel

### CDN Libraries (Phase 2)

| Library | CDN | Offline copy target |
|---------|-----|---------------------|
| markdown-it 14.1.0 | jsDelivr | `public/assets/vendor/markdown-it.min.js` |
| markdown-it-multimd-table 4.2.3 | jsDelivr | `public/assets/vendor/markdown-it-multimd-table.min.js` |

An internet connection is required on first load until files are copied into `public/assets/vendor/` and `index.html` script `src` values are updated.

## How to Test Live Preview (Phase 2)

1. Open `public/index.html` in a browser (requires network for CDN scripts on first visit).
2. Type `# Hello` in the Markdown panel — the preview should show a formatted heading immediately.
3. Click **Load Sample** — all sample elements (lists, table, blockquote, code, Hindi, Sanskrit) should render in the preview.
4. Edit the sample text — preview updates live without refreshing.
5. Click **Copy HTML** — alert confirms HTML was copied; paste into a text editor to verify.
6. Type `<script>alert('xss')</script>` — it should appear as escaped text, not run as script.
7. Click **New** — editor and preview reset to empty placeholder.
8. Click **Print / Save PDF** — print preview should show formatted document content.

## Current Status

**Phase 2: Markdown Live Preview** — Live conversion and Copy HTML are complete. Direct PDF export begins in Phase 3.
