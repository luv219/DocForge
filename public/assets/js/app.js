/**
 * Aquila DocForge — Phase 5: MVP Polish
 * Plain JavaScript + CDN libraries (markdown-it, html2pdf.js).
 *
 * Phase 5 scope:
 * - Status messages, document stats, improved error handling
 * - Templates, live preview, local PDF export (Phases 2–4)
 */

(function () {
  'use strict';

  // --- DOM references ---
  const markdownInput = document.getElementById('markdownInput');
  const previewOutput = document.getElementById('previewOutput');
  const statusMessage = document.getElementById('statusMessage');
  const wordCountEl = document.getElementById('wordCount');
  const charCountEl = document.getElementById('charCount');
  const readingTimeEl = document.getElementById('readingTime');

  const btnNew = document.getElementById('btnNew');
  const btnLoadSample = document.getElementById('btnLoadSample');
  const btnCopyHtml = document.getElementById('btnCopyHtml');
  const btnPrint = document.getElementById('btnPrint');
  const btnExportPdf = document.getElementById('btnExportPdf');
  const pdfFileNameInput = document.getElementById('pdfFileName');
  const templateSelect = document.getElementById('templateSelect');
  const loadTemplateBtn = document.getElementById('loadTemplateBtn');

  const DEFAULT_PDF_NAME = 'aquila-docforge-document';
  const EXPORT_BTN_LABEL = 'Export PDF';
  const WORDS_PER_MINUTE = 200;
  const PREVIEW_STATUS_DELAY_MS = 600;

  let previewStatusTimer = null;

  const EMPTY_PREVIEW_HTML =
    '<div class="preview-empty-state">' +
    '<p class="preview-placeholder-title">Your formatted document will appear here</p>' +
    '<p class="preview-placeholder">Type Markdown in the editor, or use <strong>Load Sample</strong> or <strong>Load Template</strong> to get started.</p>' +
    '</div>';

  // --- Sample Markdown (all element types for testing) ---
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
   * Show a status message in #statusMessage.
   * @param {string} message
   * @param {'info'|'success'|'error'} [type]
   */
  function setStatusMessage(message, type) {
    const statusType = type || 'info';
    statusMessage.textContent = message;
    statusMessage.className = 'status-message status-message--' + statusType;
  }

  /**
   * Update word count, character count, and estimated reading time.
   */
  function updateDocumentStats() {
    const text = markdownInput.value;
    const trimmed = text.trim();
    const words = trimmed === '' ? 0 : trimmed.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const readingMins = words === 0 ? 0 : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

    wordCountEl.textContent = 'Words: ' + words;
    charCountEl.textContent = 'Characters: ' + chars;
    readingTimeEl.textContent =
      words === 0 ? 'Reading time: —' : 'Reading time: ~' + readingMins + ' min';
  }

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

    if (typeof window.markdownitMultimdTable === 'function') {
      parser.use(window.markdownitMultimdTable);
    }

    return parser;
  }

  /**
   * Show the empty-state placeholder in the preview panel.
   */
  function showPreviewPlaceholder() {
    previewOutput.innerHTML = EMPTY_PREVIEW_HTML;
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
    setStatusMessage('Preview error: ' + message, 'error');
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
   * @param {boolean} [silent] — skip debounced "preview updated" status
   */
  function renderPreview(markdownText, silent) {
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

      if (!silent) {
        clearTimeout(previewStatusTimer);
        previewStatusTimer = setTimeout(function () {
          if (markdownInput.value.trim() !== '') {
            setStatusMessage('Preview updated.', 'info');
          }
        }, PREVIEW_STATUS_DELAY_MS);
      }
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
    updateDocumentStats();
    setStatusMessage('Editor cleared.', 'info');
    markdownInput.focus();
  }

  /**
   * Load Sample — insert sample Markdown and render preview immediately.
   */
  function handleLoadSample() {
    markdownInput.value = SAMPLE_MARKDOWN;
    renderPreview(SAMPLE_MARKDOWN, true);
    updateDocumentStats();
    setStatusMessage('Sample document loaded.', 'success');
    markdownInput.focus();
  }

  /**
   * Get template Markdown by key.
   * @param {string} templateKey
   * @returns {Promise<string|null>}
   */
  async function getTemplateContent(templateKey) {
    if (
      window.DOCFORGE_TEMPLATES &&
      typeof window.DOCFORGE_TEMPLATES[templateKey] === 'string'
    ) {
      return window.DOCFORGE_TEMPLATES[templateKey];
    }

    try {
      const response = await fetch('../templates/' + templateKey + '.md');
      if (response.ok) {
        return await response.text();
      }
    } catch (err) {
      // fetch often fails on file:// — JS fallback above is the primary path
    }

    return null;
  }

  /**
   * Load Template — insert selected template and render preview immediately.
   */
  async function handleLoadTemplate() {
    const templateKey = templateSelect.value;

    if (!templateKey) {
      setStatusMessage('Please select a template from the dropdown first.', 'error');
      templateSelect.focus();
      return;
    }

    const content = await getTemplateContent(templateKey);

    if (!content) {
      setStatusMessage(
        'Template could not be loaded. Refresh the page and try again.',
        'error'
      );
      return;
    }

    if (markdownInput.value.trim() !== '') {
      const templateLabel = templateSelect.options[templateSelect.selectedIndex].text;
      const confirmed = confirm(
        'Replace current editor content with the "' + templateLabel + '" template?'
      );
      if (!confirmed) {
        setStatusMessage('Template load cancelled.', 'info');
        return;
      }
    }

    const templateLabel = templateSelect.options[templateSelect.selectedIndex].text;
    markdownInput.value = content;
    renderPreview(content, true);
    updateDocumentStats();
    pdfFileNameInput.value = templateKey;
    setStatusMessage('Template loaded: ' + templateLabel + '.', 'success');
    markdownInput.focus();
  }

  /**
   * True when the preview has real document content to export or copy.
   * @returns {boolean}
   */
  function hasExportablePreview() {
    const placeholder = previewOutput.querySelector('.preview-empty-state');
    const errorBlock = previewOutput.querySelector('.preview-error');
    return !placeholder && !errorBlock && markdownInput.value.trim() !== '';
  }

  /**
   * Build a safe PDF filename from the toolbar input.
   * @returns {string}
   */
  function getPdfFilename() {
    let name = (pdfFileNameInput.value || '').trim();
    if (name === '') {
      name = DEFAULT_PDF_NAME;
    }
    name = name.replace(/\.pdf$/i, '');
    name = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '-').replace(/\s+/g, '-');
    if (name === '' || name === '.') {
      name = DEFAULT_PDF_NAME;
    }
    return name + '.pdf';
  }

  /**
   * Copy HTML — copy preview innerHTML to the clipboard.
   */
  async function handleCopyHtml() {
    if (!hasExportablePreview()) {
      setStatusMessage('Nothing to copy. Add or load Markdown content first.', 'error');
      return;
    }

    const html = previewOutput.innerHTML;

    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error('Clipboard API is not available in this browser.');
      }
      await navigator.clipboard.writeText(html);
      setStatusMessage('HTML copied to clipboard successfully.', 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not copy HTML to the clipboard.';
      setStatusMessage('Copy failed: ' + message, 'error');
    }
  }

  /**
   * Print / Save PDF — open the browser print dialog.
   */
  function handlePrint() {
    if (!hasExportablePreview()) {
      setStatusMessage('Nothing to print. Add or load Markdown content first.', 'error');
      return;
    }
    setStatusMessage('Opening print dialog…', 'info');
    window.print();
  }

  /**
   * Export PDF — generate a PDF from #previewOutput only (local browser, no upload).
   */
  async function handleExportPdf() {
    if (!hasExportablePreview()) {
      setStatusMessage(
        'Cannot export PDF. Write or load Markdown content first.',
        'error'
      );
      return;
    }

    if (typeof window.html2pdf !== 'function') {
      setStatusMessage(
        'PDF library did not load. Check your connection or add html2pdf.bundle.min.js to public/assets/vendor/.',
        'error'
      );
      return;
    }

    const filename = getPdfFilename();
    const exportTarget = previewOutput;

    exportTarget.classList.add('pdf-export-document');
    btnExportPdf.disabled = true;
    btnExportPdf.textContent = 'Exporting…';
    setStatusMessage('PDF export started…', 'info');

    const options = {
      margin: [12, 12, 12, 12],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    try {
      await window.html2pdf().set(options).from(exportTarget).save();
      setStatusMessage('PDF export completed: ' + filename, 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error during PDF export.';
      setStatusMessage('PDF export failed: ' + message, 'error');
    } finally {
      exportTarget.classList.remove('pdf-export-document');
      btnExportPdf.disabled = false;
      btnExportPdf.textContent = EXPORT_BTN_LABEL;
    }
  }

  /**
   * Live preview — update on every input in the textarea.
   */
  function handleInput() {
    renderPreview(markdownInput.value);
    updateDocumentStats();
  }

  // --- Initialize parser and wire events ---
  try {
    md = initMarkdownParser();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to initialize markdown-it.';
    showPreviewError(message);
  }

  updateDocumentStats();

  markdownInput.addEventListener('input', handleInput);

  btnNew.addEventListener('click', handleNew);
  btnLoadSample.addEventListener('click', handleLoadSample);
  loadTemplateBtn.addEventListener('click', handleLoadTemplate);
  btnCopyHtml.addEventListener('click', handleCopyHtml);
  btnPrint.addEventListener('click', handlePrint);
  btnExportPdf.addEventListener('click', handleExportPdf);

})();
