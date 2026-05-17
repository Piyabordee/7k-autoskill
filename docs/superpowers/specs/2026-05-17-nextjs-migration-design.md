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
├── tailwind.config.ts
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

---

## State Management

Use `useReducer` in SkillPlanner.tsx. No context providers needed — SkillPlanner is the only parent.

Rationale: The planner state is cohesive (all pieces relate to one build session). `useReducer` gives clean action dispatching without prop-drilling Context through many levels.

---

## CSS Migration Strategy

### From vanilla CSS to Tailwind

1. CSS custom properties (`--color-gold`, `--spacing-md`, etc.) migrate to `tailwind.config.ts` theme extensions
2. All inline styles and class-based CSS rewrite to Tailwind utility classes
3. Media queries use Tailwind responsive prefixes (`md:`, `lg:`)
4. Focus-visible styles use Tailwind `focus-visible:` variant
5. Dark background/gold accent color scheme preserved exactly

### Custom Tailwind Theme

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      '7k-bg': '#1a1a2e',       // dark blue background
      '7k-gold': '#FFD700',      // gold accent
      '7k-surface': '#16213e',   // card/surface
      '7k-danger': '#e74c3c',    // red badge
    },
    fontFamily: {
      thai: ['Sarabun', 'sans-serif'],
    },
  },
},
```

---

## PWA Strategy

Keep manual service worker in `public/sw.js` — no `next-pwa` dependency.

**Changes from current:**
- Cache list points to Next.js routes (`/`, `/planner`) instead of `index.html`
- `CACHE_NAME` bumps to `7k-skill-planner-v2`
- `manifest.json` stays in `public/`, update `start_url` to `/planner`

---

## Content Security Policy

Move CSP from `<meta>` tag to Next.js `next.config.ts` headers:

```typescript
// next.config.ts
headers: async () => [{
  source: '/(.*)',
  headers: [
    { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self';" },
  ],
}],
```

Note: Next.js requires `'unsafe-eval'` for its runtime in development. In production, this can be tightened.

---

## Stable Rules Updates

The following rules in `.claude/rules/stable-rules.md` must be updated:

| Old Rule | New Rule |
|---|---|
| No frameworks, no build step | Next.js 15 App Router + Tailwind CSS + TypeScript |
| Single HTML file, standalone | Component-based architecture in `app/` + `components/` |
| No server-side code | Server Components for static pages; no API routes until Phase 2 |

Rules that stay the same:
- Privacy first (Phase 1 has no external calls)
- Thai UI (`<html lang="th">`)
- Pattern coordinates are sacred
- Tier formula is game mechanics
- Accessible by default
- Credit snowb4ll

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
