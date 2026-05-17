# Phase 1: Next.js Core Migration — Design Spec

> Rewrite 7K Skill Planner from vanilla HTML to Next.js 15 + Tailwind CSS + TypeScript.
> All existing functionality preserved. No new features in this phase.

---

## Goal

Migrate the standalone vanilla HTML app to a Next.js 15 App Router project with identical functionality. This is the foundation for Phase 2 (Shareable Links) and Phase 3 (Community Features).

**In scope:** Framework migration, component decomposition, Tailwind rewrite, PWA setup.
**Out of scope:** New features, external APIs, database, authentication.

---

## Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | 4.x |
| Runtime deps | None | — |
| Deploy | Vercel (Hobby Free) | — |

No external runtime dependencies in Phase 1. No database, no auth, no API routes.

---

## Project Structure

```
7k-autoskill/
├── app/
│   ├── layout.tsx                 # Root layout: lang="th", meta, CSP
│   ├── page.tsx                   # Landing page (Server Component)
│   ├── planner/
│   │   └── page.tsx               # Planner page (Client Component wrapper)
│   └── globals.css                # Tailwind directives + CSS custom properties
├── components/
│   └── planner/
│       ├── SkillPlanner.tsx       # Orchestrator: state management
│       ├── ScreenCapture.tsx      # Capture button + getDisplayMedia
│       ├── CaptureCanvas.tsx      # Canvas + auto-detect + overlay buttons
│       ├── SkillSelection.tsx     # Selected skills grid + drag reorder
│       ├── ExportPreview.tsx      # Preview modal + download + copy
│       └── NameInput.tsx          # Character name input
├── lib/
│   ├── constants.ts               # PATTERN_SETTINGS, tier formula, max tier
│   ├── types.ts                   # TypeScript interfaces
│   └── utils.ts                   # sanitizeInput, calculateUsedTier, etc.
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker (cache-first)
│   └── icons/                     # PWA icons
├── next.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md                      # Updated project instructions
```

---

## Component Architecture

### SkillPlanner.tsx (Orchestrator)

Owns all state via `useReducer`. Passes state and dispatch actions to child components.

```typescript
interface PlannerState {
  detectedSkills: DetectedSkill[];   // 10 skills from capture
  selectedSkills: Skill[];           // user's ordered selection
  characterName: string;
  capturedImage: string | null;      // full screenshot data URL
  zoom: number;                      // capture canvas zoom level
}

type PlannerAction =
  | { type: 'SET_DETECTED'; skills: DetectedSkill[] }
  | { type: 'ADD_SKILL'; skill: Skill }
  | { type: 'REMOVE_SKILL'; id: number }
  | { type: 'REORDER_SKILLS'; skills: Skill[] }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_CAPTURED'; image: string | null }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'RESET' };
```

### Component Responsibilities

| Component | Responsibility | Key Browser APIs |
|---|---|---|
| ScreenCapture | Trigger screen capture, pass frame to canvas | `getDisplayMedia()` |
| CaptureCanvas | Render screenshot, auto-detect skills, overlay buttons | Canvas API |
| SkillSelection | Display selected skills, drag-to-reorder, remove | HTML5 Drag & Drop |
| ExportPreview | Generate export canvas, preview modal, download/copy | Canvas API, Clipboard API |
| NameInput | Character name with sanitization | — |

### Data Flow

```
ScreenCapture (captures frame)
  → CaptureCanvas (auto-detect, overlay buttons)
    → [dispatch ADD_SKILL]
      → SkillSelection (display + reorder)
        → [dispatch REORDER_SKILLS / REMOVE_SKILL]
          → ExportPreview (generate image, download/copy)
```

### Routing and Pages

| Route | Component Type | Content |
|---|---|---|
| `/` | Server Component | Landing page: Thai instructions, example images, "เริ่มใช้งาน" CTA linking to `/planner` |
| `/planner` | Client Component | Main skill planner (all interactive functionality) |

Navigation: simple `<Link>` from landing to planner. The current app toggles views via CSS; the new app uses Next.js file-based routing. No navigation bar needed (two pages only).

---

## State Management

Use `useReducer` in SkillPlanner.tsx. No context providers needed — SkillPlanner is the only parent.

Rationale: The planner state is cohesive (all pieces relate to one build session). `useReducer` gives clean action dispatching without prop-drilling Context through many levels.

---

## CSS Migration Strategy

### From vanilla CSS to Tailwind

1. All inline styles and class-based CSS rewrite to Tailwind utility classes
2. Media queries use Tailwind responsive prefixes (`md:`, `lg:`)
3. Focus-visible styles use Tailwind `focus-visible:` variant
4. Dark background/gold accent color scheme preserved exactly

### Custom Tailwind Theme (CSS-first, Tailwind v4)

Tailwind v4 removed `tailwind.config.ts`. Configuration is CSS-first using `@theme`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-7k-bg: #1a1a2e;
  --color-7k-gold: #FFD700;
  --color-7k-surface: #16213e;
  --color-7k-danger: #e74c3c;
  --font-thai: "Sarabun", sans-serif;
}
```

No `tailwind.config.ts` file needed.

---

## PWA Strategy

Keep manual service worker in `public/sw.js` — no `next-pwa` dependency.

**Changes from current:**
- `CACHE_NAME` bumps to `7k-skill-planner-v2`
- `manifest.json` stays in `public/`, update `start_url` to `/planner`

**Dynamic asset caching:** Next.js generates hashed assets under `/_next/static/`. The service worker cannot know these filenames at write time. Strategy:
- Pre-cache only the app shell: `/`, `/planner`, `/manifest.json`
- Use runtime cache-first for `/_next/static/` assets (they are content-hasheded, safe to cache long-term)
- Use network-first for API routes (Phase 2+)

---

## Content Security Policy

Move CSP from `<meta>` tag to Next.js `next.config.ts` headers.

**Production CSP** (no `'unsafe-eval'`):
```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self';
```

**Development CSP** (Next.js requires `'unsafe-eval'` for HMR):
```
default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self';
```

Implementation:
```typescript
// next.config.ts
const isDev = process.env.NODE_ENV === 'development';
const csp = `default-src 'self'; script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self';`;

headers: async () => [{
  source: '/(.*)',
  headers: [{ key: 'Content-Security-Policy', value: csp }],
}],
```

---

## Rules Updates

### `.claude/rules/stable-rules.md`

| Old Rule | New Rule |
|---|---|
| No frameworks, no build step | Next.js 15 App Router + Tailwind CSS 4 + TypeScript |
| Single HTML file, standalone | Component-based architecture in `app/` + `components/` |
| No server-side code | Server Components for static pages; no API routes until Phase 2 |

Rules that stay the same: privacy first, Thai UI, pattern coordinates sacred, tier formula, accessible by default, credit snowb4ll.

### `.claude/rules/coding-style-rules.md`

| Section | Change |
|---|---|
| JavaScript → TypeScript | Update naming rules: interfaces use PascalCase, types use PascalCase. `const`/`let`, arrow functions, async/await still apply. |
| CSS → Tailwind | Remove CSS variable conventions (`:root`, kebab-case classes). Replace with Tailwind utility classes and `@theme` custom properties. Responsive uses `md:`/`lg:` prefixes. `:focus-visible` uses Tailwind variant. |
| HTML → TSX | `lang="th"` still required. ARIA labels still required. Semantic HTML5 still required. |

### `.claude/rules/security-rules.md`

| Rule | Change |
|---|---|
| XSS prevention | `sanitizeInput()` moves from `index.html`/`js/utils.js` to `lib/utils.ts`. Rule text updates file references. |
| CSP header | Moves from `<meta>` tag to `next.config.ts` headers. `unsafe-eval` conditional on dev only. |
| No external script execution | Update wording: framework scripts from `/_next/` are self-hosted. No CDN scripts. |

### Duplication eliminated

The current architecture explicitly duplicates functions between `index.html` and `js/utils.js` (noted as a key warning in CLAUDE.md). After migration, `lib/utils.ts` is the single source of truth — no duplication needed. Remove this warning from CLAUDE.md.

---

## Files Removed / Replaced

| Old File | Replacement |
|---|---|
| `index.html` (monolith) | `app/` directory (multiple components) |
| `js/utils.js` | `lib/utils.ts` + `lib/constants.ts` + `lib/types.ts` |
| `sw.js` | `public/sw.js` (updated cache list) |
| `manifest.json` | `public/manifest.json` (updated start_url) |

Old files should be removed only after verification that all functionality works in the new app.

---

## Testing Checklist

Manual testing required for every feature after migration:

- [ ] Landing page loads correctly (Thai text, example images)
- [ ] Screen capture triggers browser prompt
- [ ] Auto-detection finds 10 skills in 2x5 grid
- [ ] Overlay buttons positioned correctly over skills
- [ ] Click skill button adds to selection (with repeat)
- [ ] Drag-and-drop reordering works
- [ ] Remove skill (X button) works
- [ ] Character name input sanitizes correctly
- [ ] Preview generates correct canvas image
- [ ] Download saves PNG with correct filename
- [ ] Copy to clipboard works
- [ ] Tier calculation correct: (n-1)*4, max 70
- [ ] PWA installable, offline works after first load
- [ ] Responsive: mobile + desktop breakpoints
- [ ] Accessibility: ARIA labels, keyboard navigation, focus-visible

---

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Browser APIs (Screen Capture, Clipboard) work differently in Next.js client components | Test early; keep browser API calls identical to current code |
| Service worker caching breaks with Next.js routing | Use `next.config.ts` headers for caching; test PWA install |
| Tailwind CSS migration introduces visual regressions | Compare screenshots before/after for every screen |
| Drag-and-drop implementation changes in React | Use same HTML5 DnD API, wrap in React event handlers |
| `unsafe-eval` in CSP for Next.js runtime | Only in dev; tighten in production config |

---

## Not in Phase 1

These are explicitly deferred to later phases:

- Shareable build links (Phase 2)
- Upstash Redis storage (Phase 2)
- Community build library (Phase 3)
- Authentication (Phase 3)
- API routes (Phase 2)
- Search/filter (Phase 3)
- Likes and view counts (Phase 3)
