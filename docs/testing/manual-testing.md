# Manual Testing

> How to test the app manually — there is no automated test suite.

---

## Overview

7K Skill Planner has no automated test framework. A `js/utils.js` file exists with extracted pure functions (testable with Node.js), but the main app is tested manually in the browser. This doc describes the testing approach, prerequisites, and verification checklist.

## When to Read This

### Trigger

- Testing a change before committing
- Verifying a deployment works correctly
- Setting up a testing environment

### Read With

- `docs/build/deployment.md` [[docs/build/deployment]] — how to serve locally for testing
- `docs/integrations/browser-apis.md` [[docs/integrations/browser-apis]] — browser API requirements that affect testing

---

## Prerequisites

- **HTTPS or localhost required.** The Screen Capture API will not work over plain HTTP or `file://` protocol.
- **A 7K game client** (or a screenshot of the game's "Older Skill" page) for testing auto-detection.
- **Modern browser** — Chrome or Edge recommended. Safari has limited Screen Capture support.

## Test Checklist

### Golden Path (most critical)

1. Open app on localhost
2. Click "จับภาพหน้าจอ - ตรวจจับอัตโนมัติ"
3. Select a window/screen with 7K game open on "Older Skill" page
4. Verify: 10 overlay buttons appear over the captured image
5. Click each button — verify skill appears in selection list below
6. Drag skills to reorder — verify order changes
7. Enter a character name
8. Click "ดูตัวอย่างก่อนดาวน์โหลด"
9. Verify: preview modal shows correct image with name, tier, skill order
10. Click "📥 ดาวน์โหลด" — verify PNG downloads with correct filename
11. Click "📋 คัดลอก" — verify image copied (paste into Discord/image editor to confirm)

### Edge Cases

- [ ] Cancel screen capture prompt → returns to home page with Thai alert
- [ ] Click preview with no skills selected → shows "กรุณาเลือกสกิลอย่างน้อย 1 อัน" alert
- [ ] Click same skill button multiple times → adds duplicate entries
- [ ] Click X on selected skill → removes it, renumbers remaining
- [ ] Click "ล้างสกิลทั้งหมด" → confirmation dialog, then clears all
- [ ] Enter no name → defaults to "ไม่ระบุชื่อ" in export
- [ ] Enter special characters in name → sanitized correctly in export filename

### PWA

- [ ] Visit on Chrome — PWA install banner appears after 3 seconds (if not previously dismissed)
- [ ] Click install → PWA installs successfully
- [ ] Open installed PWA — works offline after first load

### Browser Compatibility

- [ ] Chrome/Edge: full functionality works
- [ ] Firefox: full functionality works
- [ ] Safari: screen capture and clipboard copy may not work — verify graceful degradation

## Unit-Testable Functions

`js/utils.js` contains pure functions that can be tested with Node.js:

| Function | Test cases |
|----------|------------|
| `calculateUsedTier(count)` | 0 skills → -4 (edge), 1→0, 5→16, 10→36, 19→72 |
| `calculateActualTier(count, max)` | capped at maxTier |
| `hasSelectedSkills(arr)` | empty → false, non-empty → true, null → false |
| `generateFileName(name, tier)` | Thai chars preserved, special chars replaced |
| `isValidFileName(str)` | valid PNG, invalid chars, no extension |
| `calculateSkillPosition(r, c, pattern)` | correct x,y for all grid positions |
| `isValidSkillPosition(r, c, maxR, maxC)` | in-bounds, out-of-bounds |

---

Related: [[docs/build/deployment]] | [[docs/integrations/browser-apis]] | [[docs/reference/constants]]
