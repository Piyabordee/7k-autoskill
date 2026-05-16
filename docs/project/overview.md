# Project Overview

> 7K Skill Planner — a standalone browser tool for Seven Knights players to plan and share skill builds.

---

## Overview

Standalone browser-based tool for Seven Knights (7K) players to plan and share skill builds. Built with pure HTML/CSS/JavaScript — no frameworks, no build step, no dependencies. Targeted at Thai players who capture game screenshots, auto-detect skills, select/reorder, and export as PNG or copy to clipboard with tier calculation.

## When to Read This

### Trigger

- Starting work on this project for the first time
- Understanding the project's purpose, audience, and constraints
- Checking version history or current status

### Read With

- `docs/architecture/structure.md` [[docs/architecture/structure]] — how the codebase is organized
- `docs/reference/constants.md` [[docs/reference/constants]] — critical game-derived constants

---

## Identity

| Field | Value |
|-------|-------|
| Name | 7K Skill Planner |
| Type | Standalone browser-based tool (PWA) |
| Stack | Vanilla HTML, CSS, JavaScript |
| Version | 1.6.1 |
| Live Demo | https://7k-autoskill.vercel.app/ |
| License | MIT |
| Author | snowb4ll (Piyabordee) |

## Core Features

- **Screen Capture Integration** — capture game screenshots using the browser's Screen Capture API
- **Auto-Detection** — automatically detect 10 skills in a 2×5 grid pattern from captured screenshots
- **Click-to-Select** — click overlay buttons to add skills; supports repeatable selection
- **Drag & Drop Reordering** — rearrange selected skills via drag and drop
- **Tier Calculation** — `(skills - 1) × 4` (max 70), based on game mechanics
- **Export as PNG** — download formatted image with tier info
- **Copy to Clipboard** — copy image directly for sharing to Discord/social media
- **PWA Support** — installable, works offline with service worker caching

## Dependencies

**None.** Zero runtime dependencies. The `package.json` has no dependencies — `node_modules/` exists only for dev tooling (local serving). The only external resource is Google Fonts (Kanit typeface) loaded via CDN.

## Target Audience

Thai-speaking Seven Knights players. All UI text is in Thai. The tool is designed for the workflow of: opening the game's "Older Skill" page → capturing the screen → auto-detecting → selecting → exporting.

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.6.1 | Feb 2026 | Copy to clipboard feature |
| 1.6.0 | Feb 2026 | PWA support (manifest, service worker, install prompt) |
| 1.5.0 | Feb 2026 | Removed export history — simplified app |
| 1.4.0 | Feb 2026 | Auto-detection (2×5 grid), overlay buttons, repeatable selection |
| 1.3.0 | Feb 2026 | Code refactoring, accessibility, CSP header |
| 1.0.0 | Jan 2025 | Initial release |

## Known Limitations

- **HTTPS required** — Screen Capture API requires HTTPS or localhost. Will not work over plain HTTP.
- **Safari limitations** — partial support for Screen Capture and PWA features.
- **Mobile browsers** — screen capture is limited on mobile devices.
- **Resolution-dependent** — pattern detection coordinates were measured at a specific game resolution. If the game UI changes, coordinates must be re-measured.

## Credits

Created by **snowb4ll** (Piyabordee) for the Seven Knights community.

---

Related: [[docs/architecture/structure]] | [[docs/reference/constants]] | [[docs/build/deployment]]
