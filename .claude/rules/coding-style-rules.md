# Coding Style Rules

Code conventions for this repository. Follow these when writing or modifying code.

## JavaScript

- **ES6+ only**: `const`/`let`, arrow functions, async/await, template literals. No `var`.
- **Naming**: camelCase for functions and variables (`captureImage`, `selectSkillByPosition`). UPPER_SNAKE_CASE for constants (`PATTERN_SETTINGS`, `CACHE_NAME`).
- **Error handling**: try/catch with `console.error()` for logging, user-facing alerts in Thai.
- **XSS prevention**: use `textContent` for user input. Never use `innerHTML` with unsanitized data.
- **Comments**: English for code logic. Thai only for UI-facing strings.

## CSS

- **CSS Variables**: use project variables (`--color-gold`, `--spacing-md`, `--radius-md`). Define new ones in `:root` if a value is reused.
- **Naming**: kebab-case for classes (`skill-button`, `capture-controls`).
- **Responsive**: mobile-first with `@media (max-width: 768px)` breakpoints.
- **Accessibility**: `:focus-visible` outlines on all interactive elements.

## HTML

- **Language**: `<html lang="th">` — always set.
- **Accessibility**: ARIA labels on all interactive elements (`aria-label`, `role` attributes).
- **Security**: CSP meta tag in `<head>` to restrict script/style/font sources.
- **Structure**: semantic HTML5 (`<main>`, `<section>`, `<nav>`).

## Service Worker (sw.js)

- **Caching**: cache-first strategy with `caches.match()`.
- **Versioning**: update `CACHE_NAME` when assets change to trigger cache refresh.
- **Events**: use `event.waitUntil()` for install/fetch/activate handlers.
