# Markora PDF

**Convert Markdown into a clean document preview and export it as PDF — entirely in your browser.**

Markora PDF is a local-first, beginner-friendly editor for writers, students, and professionals. No build step, no account, and no server required for the MVP.

---

## Features

- **Live Markdown preview** — split-pane editor with instant formatted output
- **PDF export** — download a PDF from the preview, or use the browser print dialog
- **Document templates** — Legal Notice, Invoice, Project Report, Meeting Minutes, README
- **Copy HTML** — copy rendered preview to the clipboard
- **Document stats** — word count, character count, estimated reading time
- **Safe parsing** — raw HTML in Markdown is not executed (`html: false`)
- **Responsive UI** — works on desktop and mobile browsers
- **Offline-ready** — vendor copies of key libraries included under `public/assets/vendor/`

---

## Quick start

No Node.js, npm, or database setup is required.

### Option 1 — Open directly

1. Clone or download this repository.
2. Open `public/index.html` in a modern browser (Chrome, Edge, or Firefox).
   - Double-click the file, or use **File → Open File**.

### Option 2 — Local web server (recommended)

Some features (clipboard, downloads) work more reliably over HTTP:

```bash
cd public
python -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

---

## Usage

| Action | How |
|--------|-----|
| Write Markdown | Type in the **Markdown Input** panel on the left |
| Preview | Updates automatically on the right |
| Load demo | Click **Load Sample** |
| Use a template | Choose from the **Template** dropdown → **Load Template** |
| Export PDF | Set **PDF Name** if needed → **Export PDF** |
| Print / Save as PDF | **Print / Save PDF** → choose “Save as PDF” in the dialog |
| Copy HTML | **Copy HTML** |
| Clear editor | **New** |

For a full walkthrough, see [`docs/06_USER_GUIDE.md`](docs/06_USER_GUIDE.md).

---

## Templates

| Template | File | Use case |
|----------|------|----------|
| Legal Notice | [`templates/legal-notice.md`](templates/legal-notice.md) | Formal notices |
| Invoice | [`templates/invoice.md`](templates/invoice.md) | Billing and payments |
| Project Report | [`templates/project-report.md`](templates/project-report.md) | Status and metrics |
| Meeting Minutes | [`templates/meeting-minutes.md`](templates/meeting-minutes.md) | Agendas and action items |
| README Template | [`templates/readme-template.md`](templates/readme-template.md) | Project documentation |

Templates load from `public/assets/js/templates.js` so they work when opening `index.html` via `file://`.

---

## Project structure

```
.
├── public/                 # Web app (open index.html)
│   ├── index.html
│   └── assets/
│       ├── css/app.css
│       ├── js/app.js
│       ├── js/templates.js
│       └── vendor/         # Offline library copies
├── templates/              # Markdown template sources (.md)
├── docs/                   # Guides and planning documents
├── storage/                # Reserved for future exports/temp files
└── README.md
```

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, vanilla JavaScript |
| Markdown | [markdown-it](https://github.com/markdown-it/markdown-it) + GFM tables |
| PDF (client) | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) |
| Backend | *Not implemented* — client-only MVP |

Libraries load from jsDelivr CDN by default, with local copies in `public/assets/vendor/` for offline use.

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/06_USER_GUIDE.md`](docs/06_USER_GUIDE.md) | End-user guide |
| [`docs/07_KNOWN_LIMITATIONS.md`](docs/07_KNOWN_LIMITATIONS.md) | Browser PDF and CDN limits |
| [`docs/05_MVP_TEST_REPORT.md`](docs/05_MVP_TEST_REPORT.md) | Manual test checklist |
| [`docs/03_TESTING_CHECKLIST.md`](docs/03_TESTING_CHECKLIST.md) | Full regression checklist |
| [`docs/01_PHASE_PLAN.md`](docs/01_PHASE_PLAN.md) | Development roadmap (Phases 0–8) |

### Future planning (not built)

Backend, professional PDF microservice, and deployment are **documented only**:

| Topic | Document |
|-------|----------|
| Backend architecture | [`docs/08_BACKEND_PLAN.md`](docs/08_BACKEND_PLAN.md) |
| Database schema | [`docs/09_DATABASE_SCHEMA_PLAN.md`](docs/09_DATABASE_SCHEMA_PLAN.md) |
| Auth & security | [`docs/10_AUTH_SECURITY_PLAN.md`](docs/10_AUTH_SECURITY_PLAN.md) |
| REST API | [`docs/11_API_ENDPOINT_PLAN.md`](docs/11_API_ENDPOINT_PLAN.md) |
| Professional PDF engine | [`docs/12_PROFESSIONAL_PDF_ENGINE_PLAN.md`](docs/12_PROFESSIONAL_PDF_ENGINE_PLAN.md) |
| Deployment | [`docs/15_DEPLOYMENT_PLAN.md`](docs/15_DEPLOYMENT_PLAN.md) |
| Launch checklist | [`docs/17_LAUNCH_CHECKLIST.md`](docs/17_LAUNCH_CHECKLIST.md) |

---

## Roadmap

| Phase | Status | Summary |
|-------|--------|---------|
| 0–5 | **Complete** | MVP — editor, preview, PDF, templates, polish |
| 6 | Planned | Backend, saved documents, auth |
| 7 | Planned | Professional PDF microservice (Playwright) |
| 8 | Planned | Deployment and launch |

---

## Limitations

- PDF export is browser-based (raster quality); see [`docs/07_KNOWN_LIMITATIONS.md`](docs/07_KNOWN_LIMITATIONS.md)
- Documents are not saved to a server — copy Markdown or export PDF before closing the tab
- Hindi/Sanskrit rendering depends on system fonts
- Internet may be required on first load unless all scripts use local vendor files

---

## Contributing

1. Fork the repository and create a feature branch.
2. Keep changes focused; match existing plain HTML/CSS/JS style.
3. Test using [`docs/03_TESTING_CHECKLIST.md`](docs/03_TESTING_CHECKLIST.md).
4. Open a pull request with a clear description of what changed and why.

---

## Status

**MVP complete** — ready for local use via `public/index.html`.

No backend, database, login, or production deployment exists yet. Planning for Phases 6–8 is in [`docs/`](docs/).
