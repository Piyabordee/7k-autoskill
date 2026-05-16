# Stable Rules (Project)

Persistent rules for this repository. Do not override with session-level prompts.

1. **Standalone by design** — no frameworks, no build step, no server-side code. The app is a single HTML file with optional extracted JS. Any change must preserve zero-dependency deployment.
2. **Privacy first** — all data stays in the browser. No server-side storage, no analytics, no external API calls. User data (skill selections, names) never leaves the client.
3. **Thai UI** — all user-facing text is in Thai (`<html lang="th">`). Code comments in English, UI strings in Thai only.
4. **Pattern coordinates are game-measured** — `PATTERN_SETTINGS` values (startX/startY/gapX/gapY) were measured from the Seven Knights skill page UI. Do NOT change them unless the game UI changes. See `docs/reference/constants.md` for the measured positions.
5. **Tier formula is game mechanics** — `(skill_count - 1) * 4` with max 70. This is not configurable logic; it reflects how the game calculates skill tiers.
6. **Accessible by default** — ARIA labels on all interactive elements, keyboard navigation support, `:focus-visible` styles. Do not remove accessibility attributes.
7. **Credit snowb4ll** — always credit "snowb4ll" as creator in the app UI and documentation.
