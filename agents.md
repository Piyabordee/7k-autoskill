# 7K Skill Planner - Development Context

## Project Overview

**Goal:** Create a standalone browser-based tool for Seven Knights (7K) players to plan and share their skill builds.

**Target Audience:** 7K players who want to:
- Capture game screenshots
- Select and arrange skills in desired order
- Export the result as an image with tier calculation
- Keep local history of their builds

## Completed Features

### Core Functionality
1. **Screen Capture** - Using `navigator.mediaDevices.getDisplayMedia()`
2. **Auto-Detection** - Pattern-based skill detection (2 rows × 5 columns grid)
3. **Overlay Buttons** - Clickable buttons on captured image to select skills
4. **Drag & Drop** - Reorder selected skills
5. **Repeat Selection** - Can click same skill multiple times
6. **Tier Calculation** - Auto formula: `(skills - 1) × 4` with max 70
7. **Export as PNG** - Formatted image with title, name, skills, and tier info
8. **Local History** - Saves up to 20 records in localStorage (last 5 with images)

### UI/UX
- Main page with usage instructions
- Example images (Older Skill page, Export result)
- Favicon (logo.png)
- Credit: "สร้างโดย snowb4ll"
- History button with clear Thai label
- Image thumbnails in history list
- Preview modal for full-size view

### Export Format
```
7K Skill Order: [ชื่อตัวละคร]
X Skills - จบ Y/70 เทิร์น
[skill images in grid]
```
Filename: `[ชื่อ]_จบY_70.png`

## File Structure

```
7k-autoskill/
├── index.html          # Main application (standalone HTML)
├── Example.png        # Example: Older Skill page to open
├── Finish.png          # Example: Export result preview
├── logo.png            # Favicon icon
├── README.md           # Documentation
├── LICENSE             # MIT License (Copyright 2026 Piyabordee)
├── AGENTS.md           # This file (includes pattern settings)
└── .github/
    ├── description     # Repo description for GitHub
    └── custom_topics   # Repo topics
```

## Technical Stack

- **Pure HTML/CSS/JavaScript** - No frameworks
- **Canvas API** - Image cropping and export
- **Screen Capture API** - Browser-based screen capture
- **localStorage** - Client-side history storage
- **Drag & Drop API** - Skill reordering

## Key Design Decisions

1. **Standalone HTML** - Single file for easy use and sharing
2. **Local storage only** - No server, privacy-focused
3. **Pattern-based Detection** - Grid-based auto-detection (2 rows × 5 columns) with fixed positions
4. **Pattern Settings** - startX=347, startY=365, gapX=173, gapY=70, skillSize=70, rows=2, cols=5 (see Pattern Detection Settings section above)
5. **Overlay UI** - Clickable buttons overlaid on captured image for skill selection
6. **Repeatable Selection** - Users can click same skill multiple times to build their sequence
7. **Max 20 history items** - Balances utility with storage limits
8. **Only 5 images stored** - Older records keep metadata but images are purged
9. **Thai language UI** - Target audience is Thai players

## Pattern Detection Settings

ค่าที่ปรับแล้วให้ตรงกับตำแหน่งสกิลจริงในเกม 7K

### ค่าการตั้งค่ารูปแบบ (Pattern Settings)

| ตั้งค่า | ค่า | หน่วย |
|---------|------|------|
| ตำแหน่งเริ่มต้น X | 347 | px |
| ตำแหน่งเริ่มต้น Y | 365 | px |
| จำนวนแถว | 2 | - |
| จำนวนคอลัมน์ | 5 | - |
| ระยะห่างแนวนอน (Gap X) | 173 | px |
| ระยะห่างแนวตั้ง (Gap Y) | 70 | px |
| ขนาดสกิล | 70 | px |

### ตำแหน่งสกิลจริง (จากการวัด)

```
Skill 1: x=348, y=361
Skill 2: x=346, y=437
Skill 3: x=519, y=366
Skill 4: x=520, y=435
Skill 5: x=690, y=366
Skill 6: x=694, y=438
Skill 7: x=865, y=367
Skill 8: x=864, y=429
Skill 9: x=1038, y=363
Skill 10: x=1033, y=433
```

### การคำนวณ

**แถวบน (Skills 1, 3, 5, 7, 9)**
- จุดศูนย์กลาง Y เฉลี่ย: 364.6
- ช่วง Y: 361-367

**แถวล่าง (Skills 2, 4, 6, 8, 10)**
- จุดศูนย์กลาง Y เฉลี่ย: 434.4
- ช่วง Y: 429-438

**ระยะห่าง**
- Gap Y (ระหว่างแถว): 434.4 - 364.6 = 69.8 ≈ 70
- Gap X (ระหว่างคอลัมน์): ~172-173

## Deployment

- **GitHub Repository:** https://github.com/Piyabordee/7k-autoskill
- **Vercel URL:** https://7k-autoskill.vercel.app/
- **Auto-deploy:** Vercel auto-deploys on git push

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01 | Initial release with all core features |
| 1.1.0 | 2025-01 | Added export history with thumbnails |
| 1.2.0 | 2025-01 | Added favicon and repository metadata |
| 1.3.0 | 2026-02 | Code refactoring and improvements: Removed unused functions, fixed image loading race condition, added input validation, improved accessibility with ARIA labels and focus styles, added CSS variables, separated inline styles, added lazy loading, added CSP header |
| 1.4.0 | 2026-02 | Auto-Detection Feature: Added pattern-based skill detection (2×5 grid), overlay buttons for skill selection, repeatable skill selection, updated UI flow - capture → auto-detect → click to select → export. Pattern settings: startX=347, startY=365, gapX=173, gapY=70, skillSize=70, rows=2, cols=5 |

## Current Status

✅ **Production Ready** - All core features implemented and deployed.

### What Works:
- Screen capture from browser
- Auto-detection of 10 skills using pattern (2 rows × 5 columns)
- Overlay buttons on captured image for skill selection
- Repeatable skill selection (can click same skill multiple times)
- Drag & drop reordering
- Name input
- Export with tier calculation
- Local history with thumbnails
- Preview modal
- Responsive design

### Known Limitations:
- Requires HTTPS or localhost for Screen Capture API
- Safari has partial support
- Mobile browsers may have limited screen capture support

## For New AI Assistants

When helping with this project:

1. **Understand the Goal:** This is a simple skill planning tool for 7K game players. Keep it simple and focused.

2. **UI Language:** The UI is in Thai. Keep all user-facing text in Thai.

3. **Standalone Philosophy:** The tool is a single HTML file. Avoid adding external dependencies unless absolutely necessary.

4. **Privacy First:** All data stays in the user's browser. No server-side storage.

5. **Creator Credit:** Always credit "snowb4ll" as the creator. The real name in the game is "snowb4ll".

6. **Tier Formula:** The tier calculation is `(skill_count - 1) * 4` with max 70. This is fixed logic for the game.

7. **File Naming:** Export filenames follow pattern: `[name]_จบ[tier]_70.png`

8. **Deployment:** Changes are auto-deployed to Vercel on git push.

## Quick Start Commands

```bash
# View current files
ls -la

# Check git status
git status

# Commit and push (auto-deploys to Vercel)
git add -A && git commit -m "message" && git push
```

## Contact & Support

- **Live Demo:** https://7k-autoskill.vercel.app/
- **GitHub Issues:** https://github.com/Piyabordee/7k-autoskill/issues
- **Creator (in-game):** snowb4ll

---

*"Tools that make gaming more enjoyable"* 🎮
