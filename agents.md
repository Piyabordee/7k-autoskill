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
2. **Click-to-Capture** - Click on skills to auto-crop (8% size, square)
3. **Zoom Controls** - Zoom in/out/reset for better visibility
4. **Drag & Drop** - Reorder captured skills
5. **Tier Calculation** - Auto formula: `(skills - 1) × 4` with max 70
6. **Export as PNG** - Formatted image with title, name, skills, and tier info
7. **Local History** - Saves up to 20 records in localStorage (last 5 with images)

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
├── agents.md           # This file
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
3. **Fixed crop size (8%)** - Optimized for game UI
4. **Max 20 history items** - Balances utility with storage limits
5. **Only 5 images stored** - Older records keep metadata but images are purged
6. **Thai language UI** - Target audience is Thai players

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

## Current Status

✅ **Production Ready** - All core features implemented and deployed.

### What Works:
- Screen capture from browser
- Click-to-capture skills
- Zoom controls
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
