/**
 * Aquila DocForge — Phase 1 Static UI
 * Plain JavaScript only. No build step or external libraries.
 *
 * Phase 1 scope:
 * - Wire toolbar buttons to placeholder actions
 * - New: clear editor and preview
 * - Load Sample: insert sample Markdown text (no conversion yet)
 * - Copy HTML / Export PDF: alerts for future phases
 * - Print: uses the browser print dialog
 */

(function () {
  'use strict';

  // --- DOM references ---
  const markdownInput = document.getElementById('markdownInput');
  const previewOutput = document.getElementById('previewOutput');

  const btnNew = document.getElementById('btnNew');
  const btnLoadSample = document.getElementById('btnLoadSample');
  const btnCopyHtml = document.getElementById('btnCopyHtml');
  const btnPrint = document.getElementById('btnPrint');
  const btnExportPdf = document.getElementById('btnExportPdf');

  // --- Sample Markdown text (shown raw in Phase 1; converted in Phase 2) ---
  const SAMPLE_MARKDOWN = `# Welcome to Aquila DocForge

This is **sample Markdown** to help you test the editor layout.

## Features coming soon

- Live Markdown preview (Phase 2)
- Copy rendered HTML (Phase 2)
- Direct PDF export (Phase 3)

## Sample table

| Column A | Column B |
|----------|----------|
| Row 1    | Data     |
| Row 2    | More     |

> A blockquote for preview testing in Phase 2.

Type your own Markdown in the left panel anytime.
`;

  /**
   * Reset the preview panel to its empty placeholder state.
   */
  function clearPreview() {
    previewOutput.innerHTML =
      '<p class="preview-placeholder">Your formatted preview will appear here in Phase 2.</p>';
  }

  /**
   * New — clear the textarea and preview.
   */
  function handleNew() {
    markdownInput.value = '';
    clearPreview();
    markdownInput.focus();
  }

  /**
   * Load Sample — insert sample Markdown into the textarea.
   * Does not convert to HTML yet (Phase 2).
   */
  function handleLoadSample() {
    markdownInput.value = SAMPLE_MARKDOWN;
    // Preview stays as placeholder until Phase 2 live rendering
  }

  /**
   * Copy HTML — placeholder for Phase 2.
   */
  function handleCopyHtml() {
    alert('HTML copy will be added in Phase 2.');
  }

  /**
   * Print / Save PDF — open the browser print dialog.
   * User can choose "Save as PDF" in most browsers.
   */
  function handlePrint() {
    window.print();
  }

  /**
   * Export PDF — placeholder for Phase 3 direct PDF export.
   */
  function handleExportPdf() {
    alert('Direct PDF export will be added in Phase 3.');
  }

  // --- Attach button event listeners ---
  btnNew.addEventListener('click', handleNew);
  btnLoadSample.addEventListener('click', handleLoadSample);
  btnCopyHtml.addEventListener('click', handleCopyHtml);
  btnPrint.addEventListener('click', handlePrint);
  btnExportPdf.addEventListener('click', handleExportPdf);

})();
