# Constants Reference

> Pattern detection coordinates, tier formula, and naming conventions used throughout the app.

---

## Overview

This app has a small set of hardcoded constants that are critical to correctness. Two of them (pattern coordinates and tier formula) are derived from game mechanics and must not be changed unless the game itself changes.

## When to Read This

### Trigger

- Changing how skills are detected or positioned on screen
- Modifying the tier calculation or export filename format
- Adding new skill grid layouts or export templates

### Read With

- `docs/features/auto-detection.md` [[docs/features/auto-detection]] — uses pattern constants for screen capture cropping
- `docs/features/export.md` [[docs/features/export]] — uses tier formula and naming for export output

---

## Pattern Detection

The 7K game displays skills in a 2×5 grid on the "Older Skill" page. These coordinates were manually measured from game screenshots to locate each skill icon.

| Constant | Value | Purpose |
|----------|-------|---------|
| `startX` | 347 | X position of the first skill (top-left) |
| `startY` | 365 | Y position of the first skill (first row) |
| `gapX` | 173 | Horizontal gap between skill centers |
| `gapY` | 70 | Vertical gap between rows |
| `skillSize` | 70 | Size of the crop region around each skill center |
| `rows` | 2 | Number of skill rows |
| `cols` | 5 | Number of skill columns |

### Measured Positions

These are the raw pixel positions measured from the game UI:

| Position | Row 1 (y≈365) | Row 2 (y≈435) |
|----------|---------------|---------------|
| Col 1 | x=348 | x=346 |
| Col 2 | x=519 | x=520 |
| Col 3 | x=690 | x=694 |
| Col 4 | x=865 | x=864 |
| Col 5 | x=1038 | x=1033 |

The constants are averages of these measurements. Small pixel deviations between rows are expected from the game's rendering.

### Where Used

- `index.html` lines ~1046-1054 (`PATTERN_SETTINGS` object)
- `index.html` `autoDetectSkills()` — crops skill icons at these positions
- `index.html` `createSkillButtons()` — places overlay buttons at scaled positions
- `js/utils.js` `calculateSkillPosition()` — pure function for position math

---

## Tier Calculation

| Component | Value | Purpose |
|-----------|-------|---------|
| Formula | `(skill_count - 1) * 4` | Maps number of selected skills to a tier score |
| Max tier | 70 | Hard cap from game mechanics |

### Examples

| Skills Selected | Calculation | Tier |
|----------------|-------------|------|
| 1 | (1-1)×4 = 0 | 0/70 |
| 5 | (4)×4 = 16 | 16/70 |
| 10 | (9)×4 = 36 | 36/70 |
| 18 (theoretical) | (17)×4 = 68 | 68/70 |
| 19+ | capped at 70 | 70/70 |

### Where Used

- `index.html` `previewImage()` and `downloadCanvas()` — inline calculation
- `js/utils.js` `calculateUsedTier()` and `calculateActualTier()` — extracted functions

---

## File Naming

Export files follow this pattern:

```
[displayName]_จบ[usedTier]_70.png
```

| Component | Source | Example |
|-----------|--------|---------|
| `displayName` | User input (sanitized) | น่องไก้ |
| `จบ` | Fixed Thai text meaning "finish" | — |
| `usedTier` | Tier calculation result | 36 |
| `70` | Fixed max tier | — |

### Sanitization

The display name is sanitized to allow only Thai characters (`฀-๿`), English letters, digits, and underscores (replacing all other characters).

---

## Service Worker Cache

| Constant | Value | Purpose |
|----------|-------|---------|
| `CACHE_NAME` | `7k-skill-planner-v1` | Cache version identifier |

Update `CACHE_NAME` when assets change to force cache refresh on next activation.

---

Related: [[docs/features/auto-detection]] | [[docs/features/export]] | [[docs/architecture/structure]]
