# Application Structure

> Monolithic SPA with identifiable subsystems, all inline in a single HTML file.

---

## Overview

7K Skill Planner is a single-page application where all CSS, HTML, and JavaScript live in `index.html` (1706 lines). The app has two "pages" toggled via CSS classes — no router, no framework. A small extracted utilities file (`js/utils.js`) provides pure functions for testing.

## When to Read This

### Trigger

- Adding a new feature or modifying existing subsystems
- Understanding how screen capture flows through to export
- Deciding where to put new code

### Read With

- `docs/reference/constants.md` [[docs/reference/constants]] — the pattern coordinates and tier formula that drive the core subsystems
- `docs/features/auto-detection.md` [[docs/features/auto-detection]] — detailed flow for the capture→detect pipeline

---

## Structure at a Glance

```
index.html (1706 lines)
├── <style>          lines 19-875     CSS (~860 lines)
│   ├── :root variables                design tokens
│   ├── Component styles               skill items, panels, modals
│   ├── PWA banner styles              install prompt
│   └── @media queries                 responsive breakpoints
├── <body>           lines 878-1008   HTML (~130 lines)
│   ├── Planner Page (home)            instructions + example images
│   ├── Capture Page                   canvas + overlay + selected skills
│   ├── PWA Install Banner             install prompt
│   └── Preview Modal                  export preview + download/copy buttons
└── <script>         lines 1010-1704  JavaScript (~700 lines)
    ├── State variables                captureImage, detectedSkills, selectedSkills
    ├── Page navigation                goToPlannerPage(), goToCapturePage()
    ├── PATTERN_SETTINGS               detection coordinates
    ├── autoDetectSkills()             crop skill icons from screenshot
    ├── captureScreen()                Screen Capture API integration
    ├── setupCaptureCanvas()           draw screenshot to canvas
    ├── createSkillButtons()           overlay buttons on detected skills
    ├── selectSkillByPosition()        add skill to selection
    ├── renderSelectedSkills()         update UI with selected skills
    ├── createExportCanvas()           generate PNG via Canvas API
    ├── downloadPreview() / copyPreview()  export actions
    └── PWA lifecycle                  install prompt + service worker registration
```

## Subsystem Map

| Subsystem | Lines | Responsibility | Dependencies |
|-----------|-------|----------------|--------------|
| **Screen Capture** | 1114-1176 | Capture game window via `getDisplayMedia()` | Screen Capture API |
| **Auto-Detection** | 1056-1112 | Crop 10 skill icons using pattern coordinates | Canvas API, PATTERN_SETTINGS |
| **Skill Selection** | 1298-1469 | Overlay buttons, click-to-select, drag-and-drop reorder | DOM events |
| **Export** | 1492-1619 | Generate PNG, download, or copy to clipboard | Canvas API, Clipboard API |
| **PWA** | 1628-1700 | Install prompt, service worker registration | Service Worker API |

### Data Flow

```
User clicks "จับภาพหน้าจอ"
    → captureScreen() — gets screenshot via Screen Capture API
    → setupCaptureCanvas() — draws to canvas, calculates scale
    → autoDetectSkills() — crops 10 skill icons at pattern positions
    → createSkillButtons() — places clickable overlay buttons

User clicks overlay buttons
    → selectSkillByPosition() — adds skill to selectedSkills[]
    → renderSelectedSkills() — updates UI with drag-to-reorder list

User clicks "ดูตัวอย่าง"
    → previewImage() → createExportCanvas() — generates PNG on canvas
    → shows in modal

User clicks "ดาวน์โหลด" or "คัดลอก"
    → downloadPreview() — creates <a> download link
    → copyPreview() — copies canvas blob to clipboard
```

## External Files

| File | Purpose |
|------|---------|
| `js/utils.js` | Extracted pure functions (tier calc, sanitization, position math). Duplicates some functions from inline JS — exists for testability. |
| `sw.js` | Service worker with cache-first strategy. Caches all static assets for offline use. |
| `manifest.json` | PWA manifest — app name, icons, theme, display mode. |

## Context Snapshot

- **No build step** — the app runs directly in the browser. All CSS and JS are inline in `index.html`.
- **No module system** — functions are global. There are no imports between files (except `js/utils.js` which uses CommonJS `module.exports` for testing).
- **State is global** — `captureImage`, `detectedSkills`, `selectedSkills` are module-level `let` variables.
- **js/utils.js duplication** — some functions exist both inline and in `utils.js`. The extracted version exists for unit testing with Node.js. Changes to one should be reflected in the other.

---

## Decision Trace

- **Decision:** All code inline in `index.html` instead of separate files
- **Why:** The project's principle is "standalone" — a single file that works by opening in a browser. No server, no build, no bundler. Users can download just `index.html` and it works.
- **Impact:** New features add to the monolith. If the file grows too large, consider extracting modules, but maintain the single-file deployment option.

Related: [[docs/features/auto-detection]] | [[docs/features/export]] | [[docs/reference/constants]] | [[docs/integrations/browser-apis]]
