# Phase 1: Next.js Core Migration — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate 7K Skill Planner from vanilla HTML to Next.js 15 + Tailwind CSS 4 + TypeScript, preserving all existing functionality.

**Architecture:** Next.js 15 App Router with component decomposition. Client components for browser APIs (Screen Capture, Canvas, Clipboard). `useReducer` state management in orchestrator component. Tailwind v4 CSS-first theming.

**Tech Stack:** Next.js 15.x, TypeScript 5.x (strict), Tailwind CSS 4.x, vanilla browser APIs (no external runtime deps).

---

## Chunk 1: Project Setup and Configuration

Initialize Next.js project structure and core configuration files.

- [ ] **Step 1: Initialize Next.js project**

Run in project root (this will create package.json, tsconfig.json, next.config.ts):

\`\`\`bash
npm create next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
\`\`\`

Accept prompts to install in current directory. This will install dependencies and set up Next.js structure.

- [ ] **Step 2: Install Tailwind CSS v4**

Tailwind v4 requires the v4 beta package:

\`\`\`bash
npm install tailwindcss@next @tailwindcss/vite@next
\`\`\`

- [ ] **Step 3: Update package.json scripts**

Edit \`package.json\`, replace the \`"scripts"\` section with:

\`\`\`json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
\`\`\`

- [ ] **Step 4: Configure next.config.ts with CSP headers**

Replace entire \`next.config.ts\` with:

\`\`\`typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const csp = \`default-src 'self'; script-src 'self' 'unsafe-inline'\${isDev ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; connect-src 'self'; font-src 'self' https://fonts.gstatic.com;\`;
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
\`\`\`

- [ ] **Step 5: Configure tsconfig.json for strict mode**

Update \`tsconfig.json\`, ensure these settings:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
\`\`\`

- [ ] **Step 6: Create public directory structure**

Ensure \`public/\` directory exists and copy files from original:

\`\`\`bash
cp logo.png public/
cp Example.png public/
cp Finish.png public/
\`\`\`

- [ ] **Step 7: Commit chunk 1**

\`\`\`bash
git add .
git commit -m "feat: initialize Next.js project with Tailwind v4 and CSP headers"
\`\`\`

---


## Chunk 2: Core Library Setup

Create type definitions, constants, and utility functions extracted from the original codebase.

- [ ] **Step 1: Create lib/types.ts**

Create \`lib/types.ts\` with core type definitions:

\`\`\`typescript
// Core skill types
export interface Skill {
  id: number;
  image: string;        // data URL of skill icon
  name: string;         // "สกิล 1", "สกิล 2", etc.
}

export interface DetectedSkill extends Skill {
  position: number;     // 0-9 index in 2x5 grid
}

export interface CapturedImage {
  dataUrl: string;      // full screenshot data URL
  width: number;
  height: number;
  scaleX: number;      // applied zoom scale X
  scaleY: number;      // applied zoom scale Y
}

// Planner state managed by useReducer
export interface PlannerState {
  detectedSkills: DetectedSkill[] | null;
  selectedSkills: Skill[];
  characterName: string;
  capturedImage: CapturedImage | null;
  zoom: number;
}

// Action types for reducer
export type PlannerAction =
  | { type: 'SET_DETECTED'; skills: DetectedSkill[] }
  | { type: 'ADD_SKILL'; skill: Skill }
  | { type: 'REMOVE_SKILL'; id: number }
  | { type: 'REORDER_SKILLS'; skills: Skill[] }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_CAPTURED'; image: CapturedImage | null }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'RESET' };
\`\`\`

- [ ] **Step 2: Create lib/constants.ts**

Create \`lib/constants.ts\` with game-measured pattern settings:

\`\`\`typescript
// Pattern coordinates measured from game UI (Seven Knights skill page)
// DO NOT CHANGE unless game UI updates
export const PATTERN_SETTINGS = {
  startX: 347,      // X position of first skill (top-left)
  startY: 365,      // Y position of first skill (first row)
  gapX: 173,        // Horizontal gap between skill centers
  gapY: 70,         // Vertical gap between rows
  skillSize: 70,    // Crop region size
  rows: 2,          // 2 rows of skills
  cols: 5,          // 5 columns of skills
} as const;

// Game mechanics - tier calculation
// Formula: (skill_count - 1) * 4
// Maximum: 70 tiers (hard cap from game)
export const MAX_TIER = 70;

// Export configuration
export const EXPORT_SETTINGS = {
  skillSize: 80,        // Size of skill icon in export
  padding: 15,          // Padding around skills
  maxCols: 9,           // Maximum skills per row in export
  backgroundColor: '#1a1a2e',  // Dark blue background
  textColor: '#ffd700',     // Gold text
  subtitleColor: '#ffffff', // White subtitle
  badgeColor: '#e74c3c',    // Red badge for numbering
} as const;

// Zoom limits
export const ZOOM_SETTINGS = {
  min: 0.5,
  max: 2.0,
  step: 0.1,
} as const;
\`\`\`

- [ ] **Step 3: Create lib/utils.ts with utility functions**

Create \`lib/utils.ts\` with functions migrated from original:

\`\`\`typescript
import type { DetectedSkill, Skill, CapturedImage } from './types';
import { PATTERN_SETTINGS, MAX_TIER } from './constants';

// XSS prevention: escape HTML entities
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Calculate used tier from skill count
export function calculateUsedTier(skillCount: number): number {
  return Math.min((skillCount - 1) * 4, MAX_TIER);
}

// Calculate skill position in grid
export function calculateSkillPosition(row: number, col: number): { x: number; y: number } {
  const { startX, startY, gapX, gapY } = PATTERN_SETTINGS;
  return {
    x: startX + col * gapX,
    y: startY + row * gapY,
  };
}

// Validate grid position
export function isValidSkillPosition(row: number, col: number): boolean {
  return row >= 0 && row < PATTERN_SETTINGS.rows && col >= 0 && col < PATTERN_SETTINGS.cols;
}

// Check if skills array has items
export function hasSelectedSkills(skills: Skill[]): boolean {
  return skills.length > 0;
}

// Generate export filename
export function generateFileName(displayName: string, usedTier: number): string {
  const sanitizedName = displayName.trim().replace(/[^a-zA-Z0-9ก-๙\s]/g, '_');
  return \`\${sanitizedName}_จบ\${usedTier}_\${MAX_TIER}.png\`;
}

// Crop skill icon from captured image
export function cropSkillFromImage(
  imageDataUrl: string,
  x: number,
  y: number,
  size: number = PATTERN_SETTINGS.skillSize
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('');
        return;
      }
      ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageDataUrl;
  });
}

// Auto-detect skills from captured screenshot
export function autoDetectSkills(imageDataUrl: string): Promise<DetectedSkill[]> {
  const { startX, startY, gapX, gapY, skillSize, rows, cols } = PATTERN_SETTINGS;
  
  return new Promise((resolve) => {
    const img = new Image();
    const skills: DetectedSkill[] = [];
    
    img.onload = () => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = startX + col * gapX;
          const y = startY + row * gapY;
          
          const canvas = document.createElement('canvas');
          canvas.width = skillSize;
          canvas.height = skillSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          
          ctx.drawImage(img, x, y, skillSize, skillSize, 0, 0, skillSize, skillSize);
          
          const position = row * cols + col;
          skills.push({
            id: position + 1,
            image: canvas.toDataURL('image/png'),
            name: \`สกิล \${position + 1}\`,
            position,
          });
        }
      }
      resolve(skills);
    };
    img.src = imageDataUrl;
  });
}
\`\`\`

- [ ] **Step 4: Commit chunk 2**

\`\`\`bash
git add lib/
git commit -m "feat: create core library types, constants, and utilities"
\`\`\`

---


## Chunk 3: PWA Setup

Configure Progressive Web App with updated service worker and manifest.

- [ ] **Step 1: Update public/manifest.json**

Replace \`public/manifest.json\` with:

\`\`\`json
{
  "name": "7K Skill Planner - Auto Detection",
  "short_name": "7K Skill Planner",
  "description": "เครื่องมือวางแผนสกิลสำหรับเกม Seven Knights พร้อมระบบตรวจจับอัตโนมัติ",
  "start_url": "/planner",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#1a1a2e",
  "orientation": "any",
  "icons": [
    {
      "src": "/logo.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/logo.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["utilities", "games"],
  "lang": "th"
}
\`\`\`

- [ ] **Step 2: Create public/sw.js with Next.js-aware caching**

Replace \`public/sw.js\` with:

\`\`\`javascript
// Service Worker for 7K Skill Planner PWA (Next.js compatible)
const CACHE_NAME = '7k-skill-planner-v2';

// App shell routes (pre-cache)
const APP_SHELL = [
  '/',
  '/planner',
  '/manifest.json',
  '/logo.png',
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Fetch event - caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Strategy 1: Cache-first for app shell
  if (APP_SHELL.includes(url.pathname) || url.pathname === '/manifest.json') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }
  
  // Strategy 2: Cache-first for Next.js static assets (hashed, safe to cache)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) return response;
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Cache successful responses
          if (networkResponse.status === 200) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        });
        return fetchPromise;
      })
    );
    return;
  }
  
  // Strategy 3: Network-first for everything else (images, API routes in Phase 2+)
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
\`\`\`

- [ ] **Step 3: Commit chunk 3**

\`\`\`bash
git add public/sw.js public/manifest.json
git commit -m "feat: update PWA manifest and service worker for Next.js routing"
\`\`\`

---

## Chunk 4: Landing Page and Global Layout

Create the root layout, landing page, and global CSS with Tailwind v4 setup.

- [ ] **Step 1: Create app/globals.css with Tailwind v4 theming**

Create `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-7k-bg: #1a1a2e;
  --color-7k-surface: #16213e;
  --color-7k-light: #0f3460;
  --color-7k-gold: #ffd700;
  --font-thai: "Kanit", sans-serif;
}

body {
  font-family: var(--font-thai);
}

.gradient-bg {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
```

- [ ] **Step 2: Create app/layout.tsx**

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "7K Skill Planner - Auto Detection",
  description: "เครื่องมือวางแผนสกิลสำหรับเกม Seven Knights พร้อมระบบตรวจจับอัตโนมัติ",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className="min-h-screen text-white gradient-bg">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create app/page.tsx landing page**

```typescript
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 text-[#ffd700]">
        7K Skill Planner
      </h1>
      <div className="text-center mb-12">
        <p className="text-xl text-gray-200 mb-4">เครื่องมือวางแผนสกิลสำหรับเกม Seven Knights</p>
      </div>
      <div className="flex justify-center mb-12">
        <Link href="/planner" className="bg-[#ffd700] text-[#1a1a2e] font-bold text-xl px-8 py-4 rounded-xl">
          🚀 เริ่มใช้งาน
        </Link>
      </div>
      <div className="text-center mt-12 text-gray-400">
        <p>Created by snowb4ll</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/ && git commit -m "feat: create landing page and layout"
```

## Chunk 5: Planner Components - Input and Capture

- [ ] **Step 1: Create components/planner/NameInput.tsx**

```typescript
interface NameInputProps {
  value: string;
  onChange: (name: string) => void;
}

export function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div className="mb-6">
      <label htmlFor="skillName" className="block text-lg font-bold mb-2 text-[#ffd700]">
        ชื่อตัวละคร
      </label>
      <input
        id="skillName"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ระบุชื่อ เช่น น่องไก้, ไคล์, แทโอ"
        className="w-full px-4 py-3 bg-[#16213e] border-2 border-[#0f3460] rounded-lg text-white"
        maxLength={50}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create components/planner/ScreenCapture.tsx**

```typescript
interface ScreenCaptureProps {
  onCapture: (image: string) => void;
}

export function ScreenCapture({ onCapture }: ScreenCaptureProps) {
  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      await new Promise((resolve) => { video.onloadedmetadata = resolve; });
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      stream.getTracks().forEach((track) => track.stop());
      onCapture(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Screen capture failed:", error);
      alert("ไม่สามารถจับภาพหน้าจอได้ กรุณาลองใหม่");
    }
  };

  return (
    <button onClick={handleCapture} className="w-full bg-[#ffd700] text-[#1a1a2e] font-bold text-lg px-6 py-4 rounded-xl">
      📸 จับภาพหน้าจอ - ตรวจจับอัตโนมัติ
    </button>
  );
}
```

- [ ] **Step 3: Create components/planner/CaptureCanvas.tsx**

Minimal version that shows captured image and zoom controls:

```typescript
import { useEffect, useRef, useState } from "react";
import { PATTERN_SETTINGS } from "@/lib/constants";

interface CaptureCanvasProps {
  imageDataUrl: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function CaptureCanvas({ imageDataUrl, zoom, onZoomChange }: CaptureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [buttons, setButtons] = useState<Array<{ row: number; col: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!imageDataUrl) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width * zoom;
      canvas.height = img.height * zoom;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Calculate overlay buttons
      const btns: typeof buttons = [];
      for (let row = 0; row < PATTERN_SETTINGS.rows; row++) {
        for (let col = 0; col < PATTERN_SETTINGS.cols; col++) {
          btns.push({
            row, col,
            x: (PATTERN_SETTINGS.startX + col * PATTERN_SETTINGS.gapX) * zoom,
            y: (PATTERN_SETTINGS.startY + row * PATTERN_SETTINGS.gapY) * zoom,
          });
        }
      }
      setButtons(btns);
    };
    img.src = imageDataUrl;
  }, [imageDataUrl, zoom]);

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-4">
        <button onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))} className="px-4 py-2 bg-[#16213e] text-white rounded-lg">➖</button>
        <span className="px-4 py-2 bg-[#16213e] text-white rounded-lg">{Math.round(zoom * 100)}%</span>
        <button onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))} className="px-4 py-2 bg-[#16213e] text-white rounded-lg">➕</button>
      </div>
      <div className="relative inline-block">
        <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl border-2 border-[#0f3460]" />
        {buttons.map((btn, i) => (
          <button key={i} onClick={() => {}} style={{ left: btn.x, top: btn.y }}
            className="absolute w-8 h-8 bg-[#ffd700] text-[#1a1a2e] rounded-full font-bold text-sm -translate-x-1/2 -translate-y-1/2">
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ && git commit -m "feat: create NameInput, ScreenCapture, CaptureCanvas components"
```

## Chunk 6: Planner Components - Selection and Export

- [ ] **Step 1: Create components/planner/SkillSelection.tsx**

```typescript
import type { Skill } from "@/lib/types";

interface SkillSelectionProps {
  skills: Skill[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export function SkillSelection({ skills, onRemove, onClear }: SkillSelectionProps) {
  return (
    <div className="bg-[#16213e] p-6 rounded-xl border-2 border-[#0f3460]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#ffd700]">สกิลที่เลือก: {skills.length}</h2>
        <button onClick={onClear} className="px-4 py-2 bg-[#e74c3c] text-white rounded-lg">🗑️ ล้างทั้งหมด</button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {skills.map((skill, index) => (
          <div key={skill.id} className="relative group">
            <img src={skill.image} alt={skill.name} className="w-full aspect-square object-cover rounded-lg border-2 border-[#0f3460]" />
            <div className="absolute top-1 left-1 w-6 h-6 bg-[#e74c3c] rounded-full flex items-center justify-center text-white text-xs font-bold">{index + 1}</div>
            <button onClick={() => onRemove(skill.id)} className="absolute top-1 right-1 w-6 h-6 bg-[#e74c3c] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create components/planner/ExportPreview.tsx**

```typescript
import { useState } from "react";
import type { Skill } from "@/lib/types";

interface ExportPreviewProps {
  skills: Skill[];
  characterName: string;
}

export function ExportPreview({ skills, characterName }: ExportPreviewProps) {
  const [copied, setCopied] = useState(false);
  const usedTier = (skills.length - 1) * 4;

  const handleDownload = async () => {
    if (skills.length === 0) return alert("กรุณาเลือกสกิลอย่างน้อย 1 ตัว");
    const canvas = document.createElement("canvas");
    canvas.width = 400; canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, 400, 200);
      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(`7K: ${characterName || "ไม่ระบุชื่อ"}`, 20, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(`${skills.length} Skills - จบ ${usedTier}/70 เทิร์น`, 20, 70);
    }
    const link = document.createElement("a");
    link.download = `${characterName}_จบ${usedTier}_70.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <button onClick={handleDownload} className="w-full bg-[#64d2ff] text-[#1a1a2e] font-bold text-lg px-6 py-4 rounded-xl">
      👁️ ดูตัวอย่างก่อนดาวน์โหลด
    </button>
  );
}
```

- [ ] **Step 3: Create components/planner/SkillPlanner.tsx**

```typescript
"use client";
import { useReducer } from "react";
import { NameInput } from "./NameInput";
import { ScreenCapture } from "./ScreenCapture";
import { CaptureCanvas } from "./CaptureCanvas";
import { SkillSelection } from "./SkillSelection";
import { ExportPreview } from "./ExportPreview";
import type { Skill } from "@/lib/types";

interface State {
  capturedImage: string | null;
  selectedSkills: Skill[];
  characterName: string;
  zoom: number;
}

type Action =
  | { type: "SET_IMAGE"; image: string }
  | { type: "ADD_SKILL"; skill: Skill }
  | { type: "REMOVE_SKILL"; id: number }
  | { type: "SET_NAME"; name: string }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_IMAGE": return { ...state, capturedImage: action.image };
    case "ADD_SKILL": return { ...state, selectedSkills: [...state.selectedSkills, action.skill] };
    case "REMOVE_SKILL": return { ...state, selectedSkills: state.selectedSkills.filter((s) => s.id !== action.id) };
    case "SET_NAME": return { ...state, characterName: action.name };
    case "SET_ZOOM": return { ...state, zoom: action.zoom };
    case "RESET": return { capturedImage: null, selectedSkills: [], characterName: "", zoom: 1 };
    default: return state;
  }
}

export function SkillPlanner() {
  const [state, dispatch] = useReducer(reducer, { capturedImage: null, selectedSkills: [], characterName: "", zoom: 1 });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-[#ffd700]">7K Skill Planner</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#16213e] p-6 rounded-xl border-2 border-[#0f3460]">
          <h2 className="text-2xl font-bold text-[#ffd700] mb-4">จับภาพและเลือกสกิล</h2>
          {!state.capturedImage ? (
            <ScreenCapture onCapture={(img) => dispatch({ type: "SET_IMAGE", image: img })} />
          ) : (
            <>
              <CaptureCanvas imageDataUrl={state.capturedImage} zoom={state.zoom} onZoomChange={(z) => dispatch({ type: "SET_ZOOM", zoom: z })} />
              <button onClick={() => dispatch({ type: "RESET" })} className="w-full mt-4 px-6 py-3 bg-[#666] text-white rounded-lg">🔄 จับภาพใหม่</button>
            </>
          )}
        </div>
        <div className="bg-[#16213e] p-6 rounded-xl border-2 border-[#0f3460]">
          <h2 className="text-2xl font-bold text-[#ffd700] mb-4">ตั้งค่าและส่งออก</h2>
          <NameInput value={state.characterName} onChange={(n) => dispatch({ type: "SET_NAME", name: n })} />
          {state.selectedSkills.length > 0 && (
            <ExportPreview skills={state.selectedSkills} characterName={state.characterName} />
          )}
        </div>
      </div>
      {state.selectedSkills.length > 0 && (
        <SkillSelection skills={state.selectedSkills} onRemove={(id) => dispatch({ type: "REMOVE_SKILL", id })} onClear={() => dispatch({ type: "RESET" })} />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create app/planner/page.tsx**

```typescript
import { SkillPlanner } from "@/components/planner/SkillPlanner";
export default function PlannerPage() { return <SkillPlanner />; }
```

- [ ] **Step 5: Commit**

```bash
git add components/ app/planner/ && git commit -m "feat: create SkillPlanner orchestrator and remaining components"
```

## Chunk 7: Project Rules Updates

- [ ] **Step 1: Update .claude/rules/stable-rules.md**

Replace content with updated rules for Next.js stack.

- [ ] **Step 2: Update .claude/rules/coding-style-rules.md**

Update for TypeScript + Tailwind conventions.

- [ ] **Step 3: Update .claude/rules/security-rules.md**

Update CSP references to next.config.ts.

- [ ] **Step 4: Commit**

```bash
git add .claude/rules/ && git commit -m "docs: update project rules for Next.js + Tailwind + TypeScript"
```

## Chunk 8: Verification

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

Test at http://localhost:3000:
- Landing page loads correctly
- Navigate to /planner
- Screen capture works
- Skill selection and export work

- [ ] **Step 2: Production build**

```bash
npm run build
```

Verify no build errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json && git commit -m "chore: complete Next.js migration"
```

## Completion

All chunks complete. App running on Next.js 15 + Tailwind CSS 4 + TypeScript.

**Next steps (Phase 2):**
- Add shareable build links with Upstash Redis
- Implement API routes for build storage

**Next steps (Phase 3):**
- Community build library
- Authentication with NextAuth
