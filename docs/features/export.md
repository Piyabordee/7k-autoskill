# Export Feature

> Generate a formatted PNG image of the skill build and download or copy to clipboard.

---

## Overview

The export feature takes the user's selected and ordered skills and produces a formatted PNG image showing the skill icons in sequence with the character name, skill count, and tier calculation. The image can be downloaded as a file or copied directly to the clipboard for sharing.

## When to Read This

### Trigger

- Changing how the export image is generated or formatted
- Modifying the download filename pattern
- Adding new export methods or formats
- Fixing clipboard copy issues

### Read With

- `docs/reference/constants.md` [[docs/reference/constants]] — tier formula and file naming conventions
- `docs/integrations/browser-apis.md` [[docs/integrations/browser-apis]] — Clipboard API requirements and browser compatibility

---

## User Journey

1. User has selected skills in the Capture Page
2. User enters a character name (optional — defaults to "ไม่ระบุชื่อ")
3. User clicks "ดูตัวอย่างก่อนดาวน์โหลด"
4. Preview modal appears with the generated image
5. User clicks either:
   - "📥 ดาวน์โหลด" — downloads as PNG file
   - "📋 คัดลอก" — copies image to clipboard
   - "ปิด" — closes modal

## Flow Diagram

```
previewImage()
    → getSkillName() — sanitize user input
    → createExportCanvas(displayName)
        → calculate usedTier = (selectedSkills.length - 1) * 4
        → calculate grid layout (min 9 cols, ceil rows)
        → create offscreen canvas
        → draw dark background (#1a1a2e)
        → draw title: "7K Skill Order: [name]"
        → draw subtitle: "[N] Skills - จบ [tier]/70 เทิร์น"
        → for each skill:
            → load skill.image (dataURL) as Image
            → draw at grid position
            → draw order number badge (red circle)
        → return canvas
    → set modal image src to canvas.toDataURL()
    → show preview modal

downloadPreview()
    → generate filename: [name]_จบ[tier]_70.png
    → create <a> element with download attribute
    → click programmatically

copyPreview()
    → canvas.toBlob() → ClipboardItem → navigator.clipboard.write()
    → show success feedback (✅ คัดลอกแล้ว) for 2 seconds
```

## Key Files

| File | Lines | Role |
|------|-------|------|
| `index.html` (createExportCanvas) | ~1492-1558 | Generate export image on offscreen canvas |
| `index.html` (previewImage) | ~1473-1489 | Orchestrate preview: sanitize name, create canvas, show modal |
| `index.html` (downloadPreview) | ~1579-1590 | Generate download link with tier-based filename |
| `index.html` (copyPreview) | ~1592-1619 | Copy canvas blob to clipboard via Clipboard API |
| `index.html` (downloadCanvas) | ~1561-1569 | Alternative download function (used by other paths) |
| `js/utils.js` (generateFileName) | 49-53 | Pure function for filename generation |
| `js/utils.js` (calculateUsedTier) | 20-22 | Pure tier calculation function |

## Export Image Format

The generated PNG contains:

| Element | Appearance |
|---------|------------|
| Background | Dark blue (#1a1a2e) |
| Title | Gold (#ffd700), bold 18px: "7K Skill Order: [name]" |
| Subtitle | Gray (#aaa), 14px: "[N] Skills - จบ [tier]/70 เทิร์น" |
| Skill icons | 80×80px, arranged in grid (max 9 columns) |
| Order badges | Red circle (#ff6b6b), white number, positioned top-right of each icon |

## Configuration

| Config | Default | Purpose |
|--------|---------|---------|
| Skill icon size | 80px | Size of each skill in the export |
| Padding | 15px | Space between skills and canvas edges |
| Max columns | 9 | Maximum skills per row in export |

## Decision Trace

- **Decision:** Two export paths (download + clipboard copy) instead of download-only
- **Why:** The target audience (Thai 7K players) primarily shares builds via Discord/social media. Copy-to-clipboard enables instant sharing without saving a file first. Added in v1.6.1 based on usage patterns.
- **Impact:** Clipboard API requires user gesture and HTTPS. The copy button provides visual feedback (✅ คัดลอกแล้ว for 2 seconds) because clipboard operations are silent.

---

Related: [[docs/reference/constants]] | [[docs/integrations/browser-apis]] | [[docs/architecture/structure]] | [[docs/features/auto-detection]]
