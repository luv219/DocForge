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

1. Open the project folder: `AquilaDocForge/`
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

## Current Status

**Phase 1: Static UI** — Editor layout and toolbar are complete. Markdown live preview begins in Phase 2.
