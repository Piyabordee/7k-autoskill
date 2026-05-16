# Auto-Detection Feature

> Capture the game screen and automatically detect 10 skills in a 2×5 grid pattern.

---

## Overview

The auto-detection feature is the core workflow of the app. It uses the browser's Screen Capture API to grab the game window, then crops 10 skill icons from fixed positions based on manually measured coordinates. Users click overlay buttons positioned over each detected skill to add it to their build order.

## When to Read This

### Trigger

- Changing how skills are detected, cropped, or displayed
- Adjusting pattern coordinates or grid layout
- Fixing bugs in the capture or detection pipeline
- Adding new detection methods

### Read With

- `docs/reference/constants.md` [[docs/reference/constants]] — pattern coordinates and measured positions
- `docs/integrations/browser-apis.md` [[docs/integrations/browser-apis]] — Screen Capture API requirements and browser compatibility

---

## User Journey

1. User opens the app's home page (Planner Page)
2. User opens the "Older Skill" page in the 7K game
3. User clicks "จับภาพหน้าจอ - ตรวจจับอัตโนมัติ"
4. Browser prompts user to select a window/screen to share
5. App captures a single frame from the selected stream
6. App navigates to the Capture Page
7. `autoDetectSkills()` crops 10 skill icons at pattern positions
8. `createSkillButtons()` places numbered overlay buttons over each skill
9. User clicks buttons to add skills to their selection (repeatable)
10. User drags skills to reorder, clicks X to remove

## Flow Diagram

```
goToCapturePage()
    → captureScreen()
        → navigator.mediaDevices.getDisplayMedia()
        → capture frame to canvas via <video>
        → stream.getTracks().stop()
        → store as captureImage { naturalWidth, naturalHeight, canvas }
    → setupCaptureCanvas()
        → calculate display scale (fit to viewport)
        → draw captureImage to #captureCanvas
        → setupCanvasEvents() (visual only, clicks disabled)
    → autoDetectSkills()
        → for each (row, col) in 2×5 grid:
            → calculate position from PATTERN_SETTINGS
            → crop 60×60 region from captureImage.canvas
            → push to detectedSkills[] as dataURL
    → createSkillButtons()
        → for each (row, col) in 2×5 grid:
            → scale position by captureImage.scaleX/scaleY
            → create <div> overlay button at scaled position
            → onclick → selectSkillByPosition(row, col)
    → renderSelectedSkills()
```

## Key Files

| File | Lines | Role |
|------|-------|------|
| `index.html` (PATTERN_SETTINGS) | ~1046-1054 | Grid coordinates and dimensions |
| `index.html` (autoDetectSkills) | ~1057-1112 | Crop skill icons from screenshot canvas |
| `index.html` (captureScreen) | ~1115-1176 | Screen Capture API, frame capture |
| `index.html` (setupCaptureCanvas) | ~1179-1236 | Draw screenshot to display canvas with scaling |
| `index.html` (createSkillButtons) | ~1299-1342 | Create positioned overlay buttons |
| `index.html` (selectSkillByPosition) | ~1345-1370 | Add clicked skill to selectedSkills[] |
| `js/utils.js` (calculateSkillPosition) | 73-86 | Pure position math function |

## Configuration

| Config | Default | Purpose |
|--------|---------|---------|
| `PATTERN_SETTINGS.rows` | 2 | Number of skill rows to detect |
| `PATTERN_SETTINGS.cols` | 5 | Number of skill columns to detect |
| `PATTERN_SETTINGS.skillSize` | 70 | Crop region size in source pixels |
| Crop output size | 60×60 | Size of cropped skill icon canvas |

## Decision Trace

- **Decision:** Use overlay buttons instead of canvas click detection
- **Why:** Canvas click coordinates require manual hit-testing against the grid, and zoom/scroll made coordinate translation fragile. Overlay `<div>` elements positioned via CSS are simpler, support hover states, and automatically handle click targeting.
- **Impact:** Canvas clicks are disabled (`setupCanvasEvents` only redraws). All skill selection goes through overlay buttons.

---

Related: [[docs/reference/constants]] | [[docs/integrations/browser-apis]] | [[docs/architecture/structure]] | [[docs/features/export]]
