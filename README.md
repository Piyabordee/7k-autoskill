# 7K Skill Planner

<div align="center">

![Version](https://img.shields.io/badge/version-1.3.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

**A standalone skill planning tool for Seven Knights (7K)**

[Live Demo](https://7k-autoskill.vercel.app/) | [Report Issue](https://github.com/Piyabordee/7k-autoskill/issues)

</div>

---

## Overview

7K Skill Planner is a browser-based tool designed to help Seven Knights players plan and visualize their skill builds. Simply capture your screen, click on skills to capture them, arrange them in the desired order, and export the result as an image.

## Features

- **Screen Capture Integration** - Capture game screenshots directly using the Screen Capture API
- **Click-to-Capture** - Simply click on skills to capture them automatically (no dragging required)
- **Drag & Drop Reordering** - Easily rearrange captured skills via drag and drop
- **Tier Calculation** - Automatically calculates skill progression: `(skills - 1) × 4`
- **Export as Image** - Download your skill plan as a formatted PNG image
- **Export History** - Saves your export history locally (up to 20 records)
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
7. Click **📥 Export รูป** to download your skill plan

### Offline

1. Download [`skill-planner.html`](skill-planner.html)
2. Open it in any modern browser (Chrome, Edge, Firefox)
3. Follow the same steps as above

## Example Output

```
7K Skill Order
ชื่อ: น่องไก้
[Skill1] [Skill2] [Skill3] ... [SkillN]
10 Skills - จบ 36/70 เทิร์น
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| | 1.0.0 | 2025-01 | Initial release with all core features |
| | 1.1.0 | 2025-01 | Added export history with thumbnails |
| | 1.2.0 | 2025-01 | Added favicon and repository metadata |
| | 1.3.0 | 2026-02 | Code refactoring and improvements: Removed unused functions, fixed image loading race condition, added input validation, improved accessibility with ARIA labels and focus styles, added CSS variables, separated inline styles, added lazy loading, added CSP header |

## Browser Support
| Browser | Status |
|---------|--------|
| Chrome/Edge 90+ | ✅ Fully Supported |
| Firefox 90+ | ✅ Fully Supported |
| Safari 13+ | ⚠️ Partial Support |

> **Note:** Screen Capture API requires HTTPS or localhost.

## Technical Details

- **Built with:** Vanilla HTML, CSS, JavaScript
- **Dependencies:** None
- **File Size:** ~50 KB
- **Canvas API** - Image manipulation and cropping
- **Screen Capture API** - `navigator.mediaDevices.getDisplayMedia()`
- **Drag and Drop API** - Skill reordering

## Project Structure

```
7k-autoskill/
├── skill-planner.html    # Main application
├── README.md             # This file
├── LICENSE               # MIT License
└── agents.md             # Credits & contributors
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created for the Seven Knights community. See [agents.md](agents.md) for full credits.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## Disclaimer

This is an unofficial fan tool. Seven Knights is a trademark of its respective owners.

---

<div align="center">
Made with ❤️ for the 7K Community
</div>
