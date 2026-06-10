/**
 * Aquila DocForge — Phase 2: Live Markdown Preview
 * Plain JavaScript + markdown-it (loaded via CDN in index.html).
 *
 * Phase 2 scope:
 * - Convert Markdown to HTML with markdown-it (html: false for safety)
 * - Live preview on every keystroke
 * - Copy rendered HTML to clipboard
 * - Load Sample converts immediately
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

  // --- Sample Markdown (all element types for Phase 2 testing) ---
  const SAMPLE_MARKDOWN = `# Aquila DocForge Sample

This is a paragraph with **bold text** to demonstrate live preview formatting.

## Bullet list

- First bullet item
- Second bullet item
- Third bullet item

## Numbered list

1. First step
2. Second step
3. Third step

## Table

| Column A   | Column B   |
|------------|------------|
| Row 1 data | Row 1 more |
| Row 2 data | Row 2 more |

> This is a blockquote. It should appear with a left border and muted styling.

## Code block

\`\`\`javascript
function greet(name) {
  console.log('Hello, ' + name);
}
\`\`\`

## Hindi and Sanskrit

Hindi: यह एक हिन्दी वाक्य है।

Sanskrit: संस्कृत भाषा अत्यन्त प्राचीना अस्ति।
`;

  /** @type {import('markdown-it') | null} */
  let md = null;

  /**
   * Create the markdown-it parser with safe defaults.
   * html: false — raw HTML in Markdown is NOT executed (XSS protection).
   */
  function initMarkdownParser() {
    if (typeof window.markdownit !== 'function') {
      throw new Error(
        'markdown-it did not load. Check your internet connection, or place markdown-it.min.js in public/assets/vendor/ and update index.html.'
      );
    }

    const parser = window.markdownit({
      html: false,
      linkify: true,
      typographer: true,
    });

    // Optional GFM table plugin (loaded from CDN in index.html)
    if (typeof window.markdownitMultimdTable === 'function') {
      parser.use(window.markdownitMultimdTable);
    }

    return parser;
  }

  /**
   * Show the empty-state placeholder in the preview panel.
   */
  function showPreviewPlaceholder() {
    previewOutput.innerHTML =
      '<p class="preview-placeholder">Start typing Markdown to see a live preview.</p>';
  }

  /**
   * Show a user-friendly error inside the preview panel.
   * @param {string} message
   */
  function showPreviewError(message) {
    previewOutput.innerHTML =
      '<p class="preview-error"><strong>Preview error:</strong> ' +
      escapeHtml(message) +
      '</p>';
  }

  /**
   * Escape text for safe insertion into HTML error messages.
   * @param {string} text
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Convert Markdown string to HTML and render into #previewOutput.
   * @param {string} markdownText
   */
  function renderPreview(markdownText) {
    if (!md) {
      showPreviewError('Markdown parser is not initialized.');
      return;
    }

    const trimmed = markdownText.trim();

    if (trimmed === '') {
      showPreviewPlaceholder();
      return;
    }

    try {
      const html = md.render(markdownText);
      previewOutput.innerHTML = html;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown rendering error.';
      showPreviewError(message);
    }
  }

  /**
   * New — clear the textarea and preview.
   */
  function handleNew() {
    markdownInput.value = '';
    showPreviewPlaceholder();
    markdownInput.focus();
  }

  /**
   * Load Sample — insert sample Markdown and render preview immediately.
   */
  function handleLoadSample() {
    markdownInput.value = SAMPLE_MARKDOWN;
    renderPreview(SAMPLE_MARKDOWN);
  }

  /**
   * Copy HTML — copy preview innerHTML to the clipboard.
   */
  async function handleCopyHtml() {
    const placeholder = previewOutput.querySelector('.preview-placeholder');
    const errorBlock = previewOutput.querySelector('.preview-error');

    if (placeholder || errorBlock || markdownInput.value.trim() === '') {
      alert('Nothing to copy. Add or load Markdown content first.');
      return;
    }

    const html = previewOutput.innerHTML;

    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error('Clipboard API is not available in this browser.');
      }
      await navigator.clipboard.writeText(html);
      alert('HTML copied to clipboard successfully.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not copy HTML to the clipboard.';
      alert('Copy failed: ' + message);
    }
  }

  /**
   * Print / Save PDF — open the browser print dialog.
   */
  function handlePrint() {
    window.print();
  }

  /**
   * Export PDF — placeholder for Phase 3.
   */
  function handleExportPdf() {
    alert('Direct PDF export will be added in Phase 3.');
  }

  /**
   * Live preview — update on every input in the textarea.
   */
  function handleInput() {
    renderPreview(markdownInput.value);
  }

  // --- Initialize parser and wire events ---
  try {
    md = initMarkdownParser();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to initialize markdown-it.';
    showPreviewError(message);
  }

  markdownInput.addEventListener('input', handleInput);

  btnNew.addEventListener('click', handleNew);
  btnLoadSample.addEventListener('click', handleLoadSample);
  btnCopyHtml.addEventListener('click', handleCopyHtml);
  btnPrint.addEventListener('click', handlePrint);
  btnExportPdf.addEventListener('click', handleExportPdf);

})();
