# MVP Manual Test Report

Use this report to record hands-on testing of Aquila DocForge after Phase 5. Fill in **Actual result** and **Status** (Pass / Fail) as you test.

**Tester:** ____________________  
**Date:** ____________________  
**Browser:** ____________________  
**OS:** ____________________  
**How opened:** `file://` / local server (circle one)

---

## Test Results

| Test ID | Feature | Test input | Expected result | Actual result | Status |
|---------|---------|------------|-----------------|---------------|--------|
| T-01 | Page load | Open `public/index.html` | Editor, preview, toolbar, status bar, and stats visible; no critical console errors | | |
| T-02 | Empty state | Load page with empty editor | Preview shows empty-state message with Load Sample / Load Template hint | | |
| T-03 | Live preview | Type `# Hello World` | Heading appears in preview; status shows "Preview updated."; word count increases | | |
| T-04 | Load Sample | Click **Load Sample** | Sample Markdown in editor; preview renders all elements; status: "Sample document loaded." | | |
| T-05 | Document stats | Load sample | Words, characters, and reading time display non-zero values | | |
| T-06 | New / clear | Click **New** after typing | Editor and preview clear; stats reset; status: "Editor cleared." | | |
| T-07 | Template select guard | Click **Load Template** with "Select Template" | Status error: select a template first; editor unchanged | | |
| T-08 | Load template | Select **Invoice** → **Load Template** | Invoice content in editor and preview; PDF Name = `invoice`; status success | | |
| T-09 | Template replace confirm | With content in editor, load another template | Confirm dialog appears; Cancel keeps content; OK replaces | | |
| T-10 | Copy HTML | Load sample → **Copy HTML** | Status success; pasted HTML matches preview | | |
| T-11 | Copy HTML empty | Click **Copy HTML** with empty editor | Status error; nothing copied | | |
| T-12 | Export PDF | Load sample → **Export PDF** | Status "started" then "completed"; PDF downloads with default or custom name | | |
| T-13 | Export PDF empty | Click **Export PDF** with empty editor | Status error; no PDF download | | |
| T-14 | Custom PDF name | Set PDF Name to `my-test` → export | File downloads as `my-test.pdf` | | |
| T-15 | Print fallback | Load sample → **Print / Save PDF** | Print preview shows preview only; header/toolbar/editor hidden | | |
| T-16 | Table in PDF | Export sample or invoice | Table borders and cells visible in PDF | | |
| T-17 | Hindi / Sanskrit | Load sample → export PDF | Devanagari text readable in preview and PDF (OS-dependent) | | |
| T-18 | Long document | Paste 20+ paragraphs → export | Multi-page PDF or acceptable pagination; tab remains responsive | | |
| T-19 | XSS safety | Type `<script>alert(1)</script>` in editor | Script does not execute; text escaped or stripped in preview | | |
| T-20 | Mobile layout | Resize to ~375px width | Panels stack; buttons tappable; no horizontal overflow on toolbar | | |
| T-21 | Offline CDN | Disconnect network → refresh (if not cached) | Parser/PDF libraries fail gracefully with clear status or preview error | | |
| T-22 | Regression | Repeat T-04, T-12, T-08 in same session | All Phase 1–4 features still work | | |

---

## Summary

| Metric | Count |
|--------|-------|
| Tests passed | |
| Tests failed | |
| Tests skipped | |
| **Pass rate** | |

## Issues found

| Issue ID | Test ID | Description | Severity (P0–P3) |
|----------|---------|-------------|------------------|
| | | | |

## Sign-off

- [ ] MVP acceptable for local use
- [ ] Known limitations documented in `07_KNOWN_LIMITATIONS.md`
- [ ] User guide reviewed: `06_USER_GUIDE.md`

**Notes:**

_______________________________________________________________________________

_______________________________________________________________________________
