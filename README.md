# 7K Skill Planner

<div align="center">

<img src="logo.png" alt="7K Skill Planner Logo" width="80">



![Version](https://img.shields.io/badge/version-1.6.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

**A standalone skill planning tool for Seven Knights (7K)**

[Live Demo](https://7k-autoskill.vercel.app/) | [Report Issue](https://github.com/Piyabordee/7k-autoskill/issues)

</div>

---

## Overview

7K Skill Planner is a browser-based tool designed to help Seven Knights players plan and visualize their skill builds. Targeted at Thai players who capture game screenshots, auto-detect skills, select/reorder, and export as PNG with tier calculation.

## Screenshots

### Auto-Detection
Capture your game screen and the app automatically detects skills in a 2×5 grid pattern with overlay buttons.

<img src="Example.png" alt="Game Screen with Auto-Detection" width="600">

### Export Result
Drag to reorder skills, enter your name, and export as a formatted PNG image with tier calculation.

<img src="Finish.png" alt="Export Result Example" width="400">

## Features

- **Screen Capture Integration** - Capture game screenshots directly using the Screen Capture API
- **Auto-Detection** - Automatically detects skills in a 2×5 grid pattern with overlay buttons
- **Click-to-Capture** - Simply click on skills to capture them (repeatable selection supported)
- **Drag & Drop Reordering** - Easily rearrange captured skills via drag and drop
- **Tier Calculation** - Automatically calculates skill progression: `(skills - 1) × 4` (max 70)
- **Export as Image** - Download your skill plan as formatted PNG: `[name]_จบ[tier]_70.png`
- **PWA Support** - Install as an app, works offline with service worker caching
- **Standalone** - Single HTML file, no server or installation required
- **Privacy Focused** - All processing happens locally in your browser

## How to Use

### Online (Recommended)

1. Visit the [live demo](https://7k-autoskill.vercel.app/) page
2. Click the **📸 จับภาพหน้าจอ (Screenshot)** button
3. Select the window/screen to capture
4. **Click on each skill** you want to add to your build
5. Drag skills to **reorder** as needed
6. Enter your **character name**
7. Click **📥 ดาวน์โหลด** to download your skill plan

### Offline

1. Download [`index.html`](index.html)
2. Open it in any modern browser (Chrome, Edge, Firefox)
3. Follow the same steps as above

> **Note:** PWA features (offline support, install prompt) require HTTPS or localhost.

## Example Output

```
7K Skill Order
ชื่อ: น่องไก้
[Skill1] [Skill2] [Skill3] ... [SkillN]
10 Skills - จบ 36/70 เทิร์น
```

Export filename: `น่องไก้_จบ36_70.png`

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01 | Initial release with all core features |
| 1.1.0 | 2025-01 | Added export history with thumbnails |
| 1.2.0 | 2025-01 | Added favicon and repository metadata |
| 1.3.0 | 2026-02 | Code refactoring: removed unused functions, fixed image loading race condition, added input validation, improved accessibility with ARIA labels and focus styles, added CSS variables, separated inline styles, added lazy loading, added CSP header |
| 1.4.0 | 2026-02 | Auto-detection (2×5 grid), overlay buttons, repeatable selection |
| 1.5.0 | 2026-02 | Removed export history - simplified app |
| 1.6.0 | 2026-02 | PWA support (manifest, service worker, install prompt) |

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome/Edge 90+ | ✅ Fully Supported |
| Firefox 90+ | ✅ Fully Supported |
| Safari 13+ | ⚠️ Partial Support |

> **Note:** Screen Capture API requires HTTPS or localhost. Safari has limited support for screen capture and PWA features.

## Technical Details

- **Built with:** Vanilla HTML, CSS, JavaScript (no frameworks)
- **Dependencies:** None
- **Pattern Detection:** 2×5 grid at `startX: 347, startY: 365`, `gapX: 173, gapY: 70`
- **Tier Formula:** `(skill_count - 1) * 4` with maximum 70
- **Canvas API** - Image manipulation and cropping
- **Screen Capture API** - `navigator.mediaDevices.getDisplayMedia()`
- **Drag and Drop API** - Skill reordering
- **Service Worker** - Offline caching strategy

## Project Structure

```
7k-autoskill/
├── index.html            # Main application
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker for offline support
├── Example.png           # Example screenshot reference
├── Finish.png            # Finished state reference
├── AGENTS.md             # Development guide & credits
├── README.md             # This file
├── LICENSE               # MIT License
└── .gitignore            # Git ignore rules
```

## Deployment

```bash
# Deploy to Vercel (auto-deploy on push)
git add -A && git commit -m "message" && git push
```

**Live Demo:** https://7k-autoskill.vercel.app/

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by **snowb4ll** for the Seven Knights community. See [AGENTS.md](AGENTS.md) for full development guide and credits.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## Disclaimer

This is an unofficial fan tool. Seven Knights is a trademark of its respective owners.

---

<div align="center">
Made with ❤️ for 7K Community
</div>
