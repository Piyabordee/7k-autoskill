# 7K Skill Planner — Project Hub

> Central operational hub for AI agents working on this codebase.
> For full documentation index, see "Read First" below.
> Stable/non-negotiable rules are stored in `.claude/rules/`.

---

## Identity

| Field | Value |
|-------|-------|
| Name | 7K Skill Planner |
| Type | Standalone browser-based tool (PWA) |
| Stack | Vanilla HTML, CSS, JavaScript (no frameworks) |
| Version | 1.6.1 |
| Live | https://7k-autoskill.vercel.app/ |

---

## Read First

- `.claude/rules/stable-rules.md` — project principles (standalone, privacy, Thai UI, pattern coords)
- `.claude/rules/coding-style-rules.md` — JS/CSS/HTML/SW code conventions
- `.claude/rules/security-rules.md` — XSS prevention, CSP, sanitization rules
- `docs/_index.md` [[docs/_index]] — full documentation map

---

## Task Routing

| Task | Read First |
|------|------------|
| Change auto-detection or pattern coordinates | `docs/reference/constants.md` + `docs/features/auto-detection.md` |
| Change export/download/clipboard behavior | `docs/features/export.md` + `docs/reference/constants.md` |
| Adjust UI styling or layout | `.claude/rules/coding-style-rules.md` |
| Deploy or serve locally | `docs/build/deployment.md` |
| Add browser API features | `docs/integrations/browser-apis.md` |
| Test changes manually | `docs/testing/manual-testing.md` |

---

## Directory Tree (Authoritative)

```text
.claude/
├── rules/
│   ├── stable-rules.md
│   ├── coding-style-rules.md
│   └── security-rules.md
└── settings.local.json
docs/
├── _index.md
├── architecture/
│   └── structure.md
├── build/
│   └── deployment.md
├── features/
│   ├── auto-detection.md
│   └── export.md
├── integrations/
│   └── browser-apis.md
├── project/
│   └── overview.md
├── reference/
│   └── constants.md
└── testing/
    └── manual-testing.md
index.html              # Main application (monolithic)
js/utils.js             # Extracted pure functions for testing
sw.js                   # Service worker (cache-first)
manifest.json           # PWA manifest
decisions.md            # Design decisions log
README.md               # User-facing docs
```

---

## Quick Commands

```bash
# Serve locally (required for Screen Capture API)
python -m http.server 8000

# Deploy to production (auto-deploys on push)
git add -A && git commit -m "message" && git push
```

---

## Working Rules

1. **No frameworks or build steps** — changes must work by opening `index.html` in a browser
2. **Pattern coordinates are sacred** — `PATTERN_SETTINGS` values are game-measured, not theoretical
3. **Keep `js/utils.js` in sync** — pure functions duplicated from inline JS must match
4. **Thai UI strings only** — user-facing text in Thai, code/comments in English
5. **No server-side code** — all processing is client-side, privacy-first
6. **Test manually** — no automated tests; verify screen capture, auto-detection, and export in browser

---

## Doc Workflow

When creating or significantly modifying a feature:

1. **Feature doc** — create in `docs/features/` or appropriate category
2. **Reference update** — if adding constants/config, update `docs/reference/constants.md`
3. **Link here** — add entry to Documentation Map below
4. **Link related docs** — add wiki links in Related sections

### Where to put docs

| Category | Path | When |
|----------|------|------|
| Feature workflow | `docs/features/` | New user-facing behavior |
| Architecture | `docs/architecture/` | Structural changes |
| Reference | `docs/reference/` | New constants, config options |
| Project | `docs/project/` | Known issues, project changes |
| Build | `docs/build/` | Deploy or serve changes |
| Testing | `docs/testing/` | Testing approach changes |
| Integrations | `docs/integrations/` | New browser API usage |

---

## Documentation Map

### Project
- `docs/project/overview.md` [[docs/project/overview]] — identity, stack, version history, credits

### Architecture
- `docs/architecture/structure.md` [[docs/architecture/structure]] — monolithic SPA subsystem map and data flow

### Features
- `docs/features/auto-detection.md` [[docs/features/auto-detection]] — screen capture → detect → select workflow
- `docs/features/export.md` [[docs/features/export]] — canvas → preview → download/clipboard workflow

### Integrations
- `docs/integrations/browser-apis.md` [[docs/integrations/browser-apis]] — browser API requirements and compatibility

### Build
- `docs/build/deployment.md` [[docs/build/deployment]] — local serve, Vercel deploy, version bump

### Testing
- `docs/testing/manual-testing.md` [[docs/testing/manual-testing]] — manual test checklist, HTTPS requirements

### Reference
- `docs/reference/constants.md` [[docs/reference/constants]] — pattern coords, tier formula, file naming

---

## Key Warnings

- **Pattern coordinates are game-measured** — see `docs/reference/constants.md`. Do not change unless game UI changes.
- **`js/utils.js` duplicates inline functions** — changes to one must be reflected in the other.
- **Screen Capture requires HTTPS/localhost** — will fail on plain HTTP or `file://`.

---

## Definition of Done

- [ ] Change implemented with minimal scope
- [ ] `js/utils.js` updated if inline functions changed (or vice versa)
- [ ] Related docs updated when behavior changed
- [ ] Manual testing passed (screen capture, auto-detect, export)
- [ ] Commit is scoped to one issue/change set
- [ ] `decisions.md` updated for lasting design choices
- [ ] CLAUDE.md updated to match current project state

---

## Session Closeout

1. Update `CLAUDE.md` directory tree if structure changed
2. Update `decisions.md` with new stable decisions
3. Re-check Documentation Map links

---

## Related Files

- `README.md` — User-facing introduction
- `.claude/rules/` — Stable rules (security, coding style, project principles)
- `decisions.md` [[decisions]] — Design decisions log
