# Coding Style Rules

Code conventions for this repository. Follow these when writing or modifying code.

## TypeScript

- **Strict mode enabled**: Type safety enforced. No `any` types without explicit justification.
- **Naming**:
  - Components: PascalCase (`SkillPlanner`, `ScreenCapture`)
  - Functions: camelCase (`calculateUsedTier`, `handleCapture`)
  - Types/Interfaces: PascalCase (`PlannerState`, `DetectedSkill`)
  - Constants: UPPER_SNAKE_CASE (`PATTERN_SETTINGS`, `MAX_TIER`)
- **React patterns**: Use hooks (`useState`, `useReducer`, `useEffect`), proper prop typing, `useCallback`/`useMemo` where appropriate.
- **Error handling**: try/catch with `console.error()` for logging, user-facing alerts in Thai.

## Tailwind CSS

- **Utility classes**: Use Tailwind utility classes for all styling.
- **Custom theme**: Define custom properties in `app/globals.css` `@theme` block, not in component files.
- **Responsive**: Use `md:`, `lg:` prefixes for breakpoints.
- **Accessibility**: `:focus-visible` on all interactive elements.

## Component Structure

- **Client components**: Add `"use client"` directive at top of file for browser APIs (capture, canvas, clipboard).
- **Server components**: Use for static pages (landing page). No browser APIs.
- **Props**: Define clear TypeScript interfaces for component props.

## HTML (TSX)

- **Language**: `html lang="th"` — always set in layout.
- **Accessibility**: ARIA labels on all interactive elements.
- **Semantics**: Use semantic HTML5 (`main`, `section`, `nav`).