# Design Decisions

> Persistent design rationale that must survive context resets.

---

## 2026-05-17: Obsidian Documentation System Installation

- **Decision:** Install an Obsidian-compatible documentation system using the install-obsidian installer in `strict` mode.
- **Why:** AGENTS.md contained comprehensive development guidance mixed with code style rules, configuration, and project status. Splitting into categorized docs with a hub-and-spoke architecture improves discoverability for both AI agents and human maintainers.
- **Impact:** AGENTS.md content migrated to `docs/` structure, `.claude/rules/`, and `CLAUDE.md`. AGENTS.md is a removal candidate after verification.

## Key Architectural Decisions (pre-existing, documented for context)

### Monolithic single-file design

- **Decision:** All CSS, HTML, and JS inline in `index.html`.
- **Why:** The project's core principle is "standalone" — users should be able to download one file and use the app. No server, no build, no bundler.
- **Impact:** New features add to the monolith. The 1700-line file is manageable but should be split if it grows significantly (while preserving single-file deployment).

### Overlay buttons instead of canvas click detection

- **Decision:** Use positioned `<div>` overlay buttons over the canvas instead of canvas click coordinate detection.
- **Why:** Canvas click coordinates require manual hit-testing against the grid. Zoom/scroll made coordinate translation fragile. CSS-positioned overlays handle hover states and click targeting automatically.
- **Impact:** Canvas click events are disabled. All skill selection goes through overlay buttons.

### Two export paths (download + clipboard)

- **Decision:** Provide both file download and clipboard copy for export.
- **Why:** Target audience (Thai 7K players) shares builds via Discord/social media. Copy-to-clipboard enables instant sharing without saving a file first.
- **Impact:** Clipboard API requires user gesture and HTTPS. Added visual feedback for copy confirmation.

---

Related: [[CLAUDE]] | [[docs/architecture/structure]] | [[docs/project/overview]]
