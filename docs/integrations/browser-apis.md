# Browser APIs

> External browser APIs used by the app and their setup requirements.

---

## Overview

7K Skill Planner relies on several browser APIs that have non-trivial setup requirements — particularly HTTPS/localhost restrictions, user permission prompts, and browser compatibility caveats. This doc covers each API, what it requires, and where it's used.

## When to Read This

### Trigger

- Adding features that use browser APIs (camera, clipboard, storage, etc.)
- Debugging permission errors or "not allowed" failures
- Testing browser compatibility for new features

### Read With

- `docs/features/auto-detection.md` [[docs/features/auto-detection]] — uses Screen Capture API
- `docs/features/export.md` [[docs/features/export]] — uses Clipboard API

---

## Screen Capture API

**Used for:** Capturing the game window to detect skills.

**API:** `navigator.mediaDevices.getDisplayMedia()`

| Requirement | Detail |
|-------------|--------|
| **Protocol** | HTTPS or localhost only. Will fail on plain HTTP. |
| **User gesture** | Must be triggered by a user action (button click). Cannot be called programmatically. |
| **Permission** | Browser prompts user to select a window/screen/tab. User can decline. |
| **Streams** | Returns a `MediaStream`. The app captures a single frame then stops all tracks. |

**Error handling:** `NotAllowedError` when user cancels → shows Thai alert and returns to home page.

**Where used:** `captureScreen()` in `index.html` (~1115-1176).

---

## Clipboard API

**Used for:** Copying the export image to clipboard.

**API:** `navigator.clipboard.write([ClipboardItem])`

| Requirement | Detail |
|-------------|--------|
| **Protocol** | HTTPS or localhost. Requires secure context. |
| **User gesture** | Must be triggered by a user action. Cannot auto-copy. |
| **Permission** | May prompt for clipboard permission in some browsers. |
| **Format** | Must create a `ClipboardItem` with `image/png` blob. |

**Error handling:** Catches errors and shows Thai alert with error message.

**Where used:** `copyPreview()` in `index.html` (~1592-1619).

---

## Service Worker API

**Used for:** Offline caching and PWA installability.

**API:** `navigator.serviceWorker.register()`

| Requirement | Detail |
|-------------|--------|
| **Protocol** | HTTPS or localhost. Service workers do not register on HTTP. |
| **Scope** | Registered at `./sw.js` — controls all pages in the same directory. |
| **Cache strategy** | Cache-first: serve from cache, fall back to network. |

**Lifecycle:** Install → cache static assets. Fetch → serve from cache. Activate → clean old caches.

**Where used:** `sw.js` (service worker), registration in `index.html` (~1690-1700).

---

## Canvas API

**Used for:** Drawing captured screenshots, cropping skill icons, generating export images.

| Usage | Location |
|-------|----------|
| Screenshot display | `setupCaptureCanvas()` — draws captured frame to visible canvas |
| Skill cropping | `autoDetectSkills()` — `drawImage()` to crop 60×60 regions |
| Zoom/pan | `applyZoom()` — redraws canvas at different scale |
| Export generation | `createExportCanvas()` — composites title + skills + badges |

No special requirements. Canvas API works on all modern browsers without permissions.

---

## Browser Compatibility

| API | Chrome/Edge 90+ | Firefox 90+ | Safari 13+ |
|-----|-----------------|-------------|------------|
| Screen Capture | Full | Full | Partial |
| Clipboard (write) | Full | Full | Partial |
| Service Worker | Full | Full | Partial |
| Canvas | Full | Full | Full |
| `getDisplayMedia` | Full | Full | No support |
| Clipboard `image/png` | Full | Full 90+ | No support |

**Key gap:** Safari does not support `getDisplayMedia()` and cannot copy images to clipboard. Safari users should use the download path instead.

---

Related: [[docs/features/auto-detection]] | [[docs/features/export]] | [[docs/testing/manual-testing]]
