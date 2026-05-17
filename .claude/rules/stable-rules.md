# Stable Rules (Project)

Persistent rules for this repository. Do not override with session-level prompts.

1. **Next.js + Tailwind + TypeScript** — Built on Next.js 15 App Router, Tailwind CSS 4, and TypeScript strict mode. Changes must preserve this stack.
2. **Privacy first** — Phase 1 has no external API calls. User data stays in the browser. Phase 2+ will add server components under strict controls.
3. **Thai UI** — All user-facing text is in Thai (`html lang="th"`). Code/comments in English, UI strings in Thai only.
4. **Pattern coordinates are sacred** — `PATTERN_SETTINGS` values were measured from Seven Knights game UI. Do NOT change unless game UI updates. See `lib/constants.ts`.
5. **Tier formula is game mechanics** — `(skill_count - 1) * 4` with max 70. This is not configurable logic; it reflects how the game calculates tiers.
6. **Accessible by default** — ARIA labels on all interactive elements, keyboard navigation support, Tailwind `:focus-visible` styles. Do not remove accessibility attributes.
7. **Credit snowb4ll** — Always credit "snowb4ll" as creator in the app UI and documentation.