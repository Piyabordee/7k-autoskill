# 7K Skill Planner - Development Guide

## Project Overview

Standalone browser-based tool for Seven Knights (7K) players to plan and share skill builds. Built with pure HTML/CSS/JavaScript - no frameworks, no build step, no dependencies.

**Target:** Thai players who capture game screenshots, auto-detect skills, select/reorder, and export as PNG or copy to clipboard with tier calculation.

## Build/Test/Lint Commands

No build system, tests, or linters - pure vanilla code.

```bash
# Serve locally
python -m http.server 8000
# or
npx serve

# Deploy: git push → auto-deploys to Vercel
```

**Testing:** Manual only - open browser, capture screen, verify auto-detection and export. Requires HTTPS or localhost for Screen Capture API.

## Code Style Guidelines

### JavaScript
- **ES6+**: `const`/`let`, arrow functions, async/await, template literals
- **Naming**: camelCase (`captureImage`, `selectSkillByPosition`), UPPER_SNAKE_CASE constants (`PATTERN_SETTINGS`, `CACHE_NAME`)
- **Error handling**: try/catch with `console.error()`, user-facing alerts in Thai
- **XSS prevention**: Use `textContent` for user input, never `innerHTML` with unsanitized data
- **Comments**: English for code, Thai for UI only

```javascript
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
```

### CSS
- **CSS Variables**: `--color-gold`, `--spacing-md`, `--radius-md`
- **Naming**: kebab-case (`skill-button`, `capture-controls`)
- **Responsive**: Mobile-first with `@media (max-width: 768px)`
- **Accessibility**: `:focus-visible`, ARIA labels

```css
.btn:focus-visible {
    outline: 3px solid var(--color-gold);
    outline-offset: 2px;
}
```

### HTML
- **Language**: `<html lang="th">` - UI entirely in Thai
- **Accessibility**: ARIA labels on all interactive elements
- **Security**: CSP meta tag to restrict sources
- **Structure**: Semantic HTML5 (`<main>`, `<section>`, `<nav>`)

```html
<button onclick="downloadPreview()" aria-label="ดาวน์โหลดรูปภาพ">📥 ดาวน์โหลด</button>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline';">
```

### Service Worker (sw.js)
- **Caching**: Cache-first strategy, update `CACHE_NAME` on asset changes
- **Events**: `install`, `fetch`, `activate` with `event.waitUntil()`

```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
```

## Configuration (Fixed Values)

### Pattern Detection (2 rows × 5 columns)
- `startX: 347, startY: 365`
- `gapX: 173, gapY: 70`
- `skillSize: 70, rows: 2, cols: 5`

**Measured positions**: Row 1 (y≈365): x=348, 519, 690, 865, 1038 | Row 2 (y≈435): x=346, 520, 694, 864, 1033

**Do NOT change** unless game UI changes - these are measured coordinates from 7K skill page.

### Tier Calculation
Formula: `(skill_count - 1) * 4` with max 70. This is game mechanics, not configurable logic.

### File Naming
- Export: `[name]_จบ[tier]_70.png`
- Images: camelCase (`Example.png`, `Finish.png`)
- Files: lowercase with hyphens (`manifest.json`, `sw.js`)

## Key Principles

1. **Standalone**: Single HTML file, avoid external dependencies
2. **Privacy First**: No server-side storage, all data in browser
3. **Thai UI**: User-facing text in Thai, code/comments in English
4. **Accessibility**: ARIA labels, keyboard navigation, focus styles
5. **No Frameworks**: Vanilla JS, plain CSS, HTML5 APIs

## Deployment & Status

**Deploy:** `git add -A && git commit -m "message" && git push` → auto-deploys to Vercel

**Live Demo:** https://7k-autoskill.vercel.app/

**Current Status:** Production Ready (v1.6.1, Feb 2026) - PWA with offline support, clipboard copy feature

**Known Limitations:** Requires HTTPS/localhost; Safari has partial support; mobile browsers limited for screen capture

## Version History

| v1.6.1 | Feb 2026 | Copy to clipboard feature - copy image directly to clipboard for easy sharing |
| v1.6.0 | Feb 2026 | PWA support (manifest, service worker, install prompt) |
| v1.5.0 | Feb 2026 | Removed export history - simplified app |
| v1.4.0 | Feb 2026 | Auto-detection (2×5 grid), overlay buttons, repeatable selection |
| v1.3.0 | Feb 2026 | Code refactoring, accessibility, CSP header |
| v1.0.0 | Jan 2025 | Initial release |

## Creator Credit

Always credit "snowb4ll" as creator (in-game name).
