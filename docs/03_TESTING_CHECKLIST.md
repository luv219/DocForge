# Testing Checklist

Use this checklist during Phase 5 and after major changes. Mark items pass/fail and note the browser or device used.

---

## Phase 5 Polish Tests

- [ ] `#statusMessage` shows feedback for sample loaded, template loaded, preview updated, HTML copied, PDF started/completed/failed, editor cleared
- [ ] Status success messages use visible success styling; errors use error styling
- [ ] Word count updates as user types
- [ ] Character count updates as user types
- [ ] Reading time shows `—` when empty and `~N min` when content exists
- [ ] Empty preview shows improved empty-state title and hint text
- [ ] Editor and preview panels have clear visual separation (borders, accent colors)
- [ ] Toolbar rows wrap cleanly on tablet and mobile widths
- [ ] Empty PDF export blocked with status error (no silent failure)
- [ ] Copy HTML failure shows status error (not only console)
- [ ] Missing template selection shows status error and focuses dropdown
- [ ] Print with empty editor shows status error
- [ ] `docs/05_MVP_TEST_REPORT.md`, `docs/06_USER_GUIDE.md`, and `docs/07_KNOWN_LIMITATIONS.md` exist and are accurate

---

## UI Tests

- [ ] Page loads without console errors
- [ ] Header and title display correctly
- [ ] Editor and preview areas are visible on desktop
- [ ] Export button is visible and labeled clearly
- [ ] Layout does not break at common widths (1920px, 1366px, 768px)
- [ ] Focus states are visible for keyboard users
- [ ] Empty editor shows sensible placeholder or empty preview

---

## Markdown Live Preview Tests (Phase 2)

- [ ] Typing in `#markdownInput` updates `#previewOutput` without page refresh
- [ ] Empty textarea shows empty-state preview: "Your formatted document will appear here"
- [ ] **Load Sample** renders preview immediately (no manual refresh)
- [ ] **New** clears both textarea and preview placeholder state
- [ ] Preview updates on every keystroke (including delete and paste)
- [ ] Parser load failure shows a readable error in the preview panel (test offline if possible)
- [ ] Render errors display in preview without breaking the rest of the page
- [ ] **Copy HTML** copies `previewOutput.innerHTML` and shows success alert
- [ ] **Copy HTML** with empty preview shows a clear "nothing to copy" message
- [ ] **Copy HTML** shows error alert if clipboard API is unavailable or denied
- [ ] Raw HTML in Markdown (e.g. `<script>alert(1)</script>`) is **not** executed (`html: false`)
- [ ] Raw HTML tags display as escaped text or are stripped, not run as live HTML
- [ ] Plain URLs auto-link when `linkify: true` (e.g. `https://example.com`)

---

## Markdown Tests

- [ ] Headings (H1–H6) render with correct hierarchy
- [ ] Bold and italic render correctly
- [ ] Ordered and unordered lists render correctly
- [ ] Nested lists render correctly
- [ ] Links open in new tab (if configured) and show correct href
- [ ] Inline code and fenced code blocks render with monospace styling
- [ ] Blockquotes render with distinct styling
- [ ] Horizontal rules render
- [ ] Images render when URL is provided (if supported in MVP)
- [ ] Empty lines and paragraph breaks are preserved appropriately
- [ ] Special characters (`<`, `>`, `&`) display safely, not as raw HTML execution

---

## PDF Export Tests (Phase 3)

- [ ] **Export PDF** downloads a file without uploading data to any external API
- [ ] Export captures **only** `#previewOutput`, not header, toolbar, textarea, or footer
- [ ] **One-page PDF** — short document (single heading + paragraph) exports on one page
- [ ] **Long PDF** — document with many paragraphs spans multiple pages without severe clipping
- [ ] **Table PDF** — Load Sample table renders with borders and readable cells in PDF
- [ ] **Hindi PDF** — Devanagari Hindi line from sample is readable (not blank squares)
- [ ] **Sanskrit PDF** — Devanagari Sanskrit line from sample is readable in PDF
- [ ] **Empty export validation** — **Export PDF** with empty preview shows alert (no download)
- [ ] **Custom filename test** — set PDF Name to `my-test-doc`, export produces `my-test-doc.pdf`
- [ ] Default filename `markora-document.pdf` when input is cleared before export
- [ ] Export button shows feedback (Exporting… / success or failure alert)
- [ ] **Print / Save PDF** fallback still works and hides chrome in print preview

---

## PDF Tests

- [ ] Export produces a downloadable PDF file
- [ ] PDF content matches preview (headings, lists, paragraphs)
- [ ] PDF filename is sensible and includes date or title if applicable
- [ ] Multi-page content paginates without clipped text (where supported)
- [ ] Export works after editing content multiple times
- [ ] Export shows user feedback on success or failure
- [ ] Large documents (e.g. 5000+ words) export without freezing the tab (performance note)

---

## Hindi / Sanskrit Text Tests

- [ ] Devanagari (Hindi) text displays in preview without tofu boxes
- [ ] Sanskrit text displays correctly in preview
- [ ] Mixed English and Devanagari in one paragraph renders readably
- [ ] PDF export includes Devanagari glyphs (not blank squares)
- [ ] Appropriate web font loaded if system fonts insufficient
- [ ] RTL or complex scripts documented if out of scope for MVP

---

## Table Tests

- [ ] Simple Markdown table renders in preview
- [ ] Table headers align with body cells
- [ ] Table with multiple rows and columns renders
- [ ] Wide tables scroll or wrap on narrow screens without breaking layout
- [ ] Table appears correctly in exported PDF
- [ ] Empty cells do not collapse layout

---

## Mobile View Tests

- [ ] Layout usable on phone viewport (~375px width)
- [ ] Editor is typable on mobile (no zoom trap on iOS if avoidable)
- [ ] Preview readable without horizontal scroll for normal content
- [ ] Export button reachable and tappable (min ~44px touch target)
- [ ] Split view stacks or tabs work on small screens

---

## Browser Tests

Test on latest stable versions where possible:

- [ ] Chrome / Chromium
- [ ] Firefox
- [ ] Safari (macOS or iOS)
- [ ] Microsoft Edge

**Per browser, verify:**
- [ ] Markdown preview works
- [ ] PDF export works
- [ ] No critical console errors
- [ ] Fonts and spacing consistent with other browsers

---

## Regression Notes

| Date | Tester | Browser / Device | Failed Items | Notes |
|------|--------|------------------|--------------|-------|
|      |        |                  |              |       |
