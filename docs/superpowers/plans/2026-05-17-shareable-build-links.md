# Shareable Build Links Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่มฟีเจอร์แชร์ build สกิลผ่าน URL ทั้งแบบ full URL (privacy สูง) และ short URL

**Architecture:** Client-side encoding ด้วย pako compression + URL hash, Server-side short URL ด้วย Vercel Edge Functions และ KV

**Tech Stack:** Next.js 15, pako, Vercel KV, TypeScript

---

## Chunk 1: Compression Utilities

### Task 1.1: Install pako dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add pako to dependencies**

```bash
npm install pako @types/pako
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add pako for gzip compression"
```

---

### Task 1.2: Create compression utilities

**Files:**
- Create: `lib/compression.ts`

- [ ] **Step 1: Write compression functions**

```typescript
import pako from 'pako';

/**
 * Compress string using pako (gzip)
 */
export function compress(data: string): Uint8Array {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(data);
  return pako.deflate(uint8Array);
}

/**
 * Decompress gzip data back to string
 */
export function decompress(compressed: Uint8Array): string {
  const decompressed = pako.inflate(compressed);
  const decoder = new TextDecoder();
  return decoder.decode(decompressed);
}

/**
 * Convert Uint8Array to base64 string
 */
export function toBase64(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
export function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Test compression ratio
 */
export function testCompression() {
  const original = JSON.stringify({ name: 'test', skills: ['a'.repeat(1000)] });
  const compressed = compress(original);
  const base64 = toBase64(compressed);
  const decompressed = decompress(fromBase64(base64));
  console.log('Original size:', original.length);
  console.log('Compressed size:', compressed.length);
  console.log('Base64 size:', base64.length);
  console.log('Roundtrip matches:', original === decompressed);
}
```

- [ ] **Step 2: Test manually**

Run in browser console or add test file.

- [ ] **Step 3: Commit**

```bash
git add lib/compression.ts
git commit -m "feat: add compression utilities with pako"
```

---

## Chunk 2: Sharing Utilities

### Task 2.1: Create sharing utilities

**Files:**
- Create: `lib/sharing.ts`

- [ ] **Step 1: Write sharing encode/decode functions**

```typescript
import type { Skill } from './types';
import { compress, decompress, toBase64, fromBase64 } from './compression';
import { sanitizeInput } from './utils';

export interface BuildShare {
  n: string;      // character name (sanitized)
  s: string[];    // array of base64 skill images
  t: number;      // timestamp
  v: number;      // version for future compatibility
}

const CURRENT_VERSION = 1;
const HASH_PREFIX = '7kb:'; // prefix for URL validation

/**
 * Encode build data to URL hash
 */
export function encodeBuild(name: string, skills: Skill[]): string {
  const data: BuildShare = {
    n: sanitizeInput(name.trim().slice(0, 50)), // sanitize and limit length
    s: skills.map((s) => s.image), // already base64 data URLs
    t: Date.now(),
    v: CURRENT_VERSION,
  };

  const json = JSON.stringify(data);
  const compressed = compress(json);
  const base64 = toBase64(compressed);

  return HASH_PREFIX + base64;
}

/**
 * Decode URL hash to build data
 */
export function decodeBuild(hash: string): BuildShare | null {
  try {
    // Validate prefix
    if (!hash.startsWith(HASH_PREFIX)) {
      console.error('Invalid hash prefix');
      return null;
    }

    // Remove prefix and decode
    const base64 = hash.slice(HASH_PREFIX.length);
    const compressed = fromBase64(base64);
    const json = decompress(compressed);
    const data = JSON.parse(json) as BuildShare;

    // Validate structure
    if (!data.n || !Array.isArray(data.s) || typeof data.t !== 'number') {
      console.error('Invalid build data structure');
      return null;
    }

    data.n = sanitizeInput(data.n);

    return data;
  } catch (error) {
    console.error('Failed to decode build:', error);
    return null;
  }
}

/**
 * Validate hash format
 */
export function isValidHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false;
  if (!hash.startsWith(HASH_PREFIX)) return false;
  if (hash.length < HASH_PREFIX.length + 10) return false; // minimum size check

  try {
    const base64 = hash.slice(HASH_PREFIX.length);
    fromBase64(base64); // will throw if invalid base64
    return true;
  } catch {
    return false;
  }
}

/**
 * Get hash from current URL
 */
export function getHashFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return null;
  return hash.slice(1); // remove leading #
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/sharing.ts
git commit -m "feat: add sharing utilities for encode/decode"
```

---

## Chunk 3: Short Link Storage + Routes

### Task 3.0: Create shared KV store helper

**Files:**
- Create: `lib/shortlinks.ts`

- [ ] **Step 1: Add KV helper with TTL**

```typescript
import { kv } from '@vercel/kv';

const KEY_PREFIX = 'share:';
const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function storeHash(id: string, hash: string): Promise<void> {
  await kv.set(`${KEY_PREFIX}${id}`, hash, { ex: TTL_SECONDS });
}

export async function getHash(id: string): Promise<string | null> {
  return kv.get<string>(`${KEY_PREFIX}${id}`);
}
```

- [ ] **Step 2: Add KV dependency**

```bash
npm install @vercel/kv
```

---

### Task 3.1: Create shorten API route

**Files:**
- Create: `app/api/shorten/route.ts`

- [ ] **Step 1: Write shorten endpoint**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { storeHash } from '@/lib/shortlinks';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash } = body;

    if (!hash || typeof hash !== 'string') {
      return NextResponse.json(
        { error: 'Invalid hash format' },
        { status: 400 }
      );
    }

    // Generate short ID (10 characters)
    const shortId = nanoid(10);

    await storeHash(shortId, hash);

    // Get base URL from request
    const baseUrl = request.nextUrl.origin;

    return NextResponse.json(
      {
        shortId,
        shortUrl: `${baseUrl}/s/${shortId}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Shorten error:', error);
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Add nanoid dependency**

```bash
npm install nanoid
```

- [ ] **Step 3: Commit**

```bash
git add app/api/shorten/route.ts package.json package-lock.json
git commit -m "feat: add /api/shorten endpoint for short URLs"
```

---

### Task 3.2: Create short URL redirect page

**Files:**
- Create: `app/s/[id]/page.tsx`

- [ ] **Step 1: Create short URL redirect page (KV-backed)**

```typescript
import { redirect } from 'next/navigation';
import { getHash } from '@/lib/shortlinks';

export default async function ShortUrlPage({
  params,
}: {
  params: { id: string };
}) {
  const hash = await getHash(params.id);

  if (!hash) {
    redirect('/planner?error=not_found');
  }

  redirect(`/planner#${hash}`);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/s/[id]/page.tsx lib/shortlinks.ts package.json package-lock.json
git commit -m "feat: add KV-backed short link storage and redirect"
```

---

## Chunk 4: ShareButton Component

### Task 4.1: Create ShareButton component

**Files:**
- Create: `components/planner/ShareButton.tsx`

- [ ] **Step 1: Write ShareButton component**

```typescript
'use client';

import { useState } from 'react';
import type { Skill } from '@/lib/types';
import { encodeBuild } from '@/lib/sharing';

interface ShareButtonProps {
  characterName: string;
  skills: Skill[];
  className?: string;
}

export function ShareButton({ characterName, skills, className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopyFullUrl = async () => {
    const hash = encodeBuild(characterName, skills);
    const fullUrl = `${window.location.origin}/planner#${hash}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast('คัดลอก URL แล้ว!');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('ไม่สามารถคัดลอกได้');
    }
  };

  const handleCopyShortUrl = async () => {
    if (skills.length === 0) {
      showToast('กรุณาเลือกสกิลก่อน');
      return;
    }

    setIsLoading(true);

    try {
      const hash = encodeBuild(characterName, skills);

      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash }),
      });

      if (!response.ok) {
        throw new Error('Failed to create short URL');
      }

      const { shortUrl } = await response.json();
      await navigator.clipboard.writeText(shortUrl);
      showToast('คัดลอก Short Link แล้ว!');
      setIsOpen(false);
    } catch (error) {
      console.error('Shorten error:', error);
      showToast('ไม่สามารถสร้าง Short Link ได้');
    } finally {
      setIsLoading(false);
    }
  };

  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-6 py-3 bg-[#ffd700] text-[#1a1a2e] font-bold rounded-lg
                   hover:bg-[#ffea00] transition-colors
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-[#ffd700] ${className}`}
        aria-label="แชร์ Build"
      >
        📤 แชร์ Build
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#16213e] border-2 border-[#0f3460] 
                       rounded-lg shadow-lg z-50 min-w-[200px]">
          <button
            onClick={handleCopyFullUrl}
            className="w-full px-4 py-3 text-left text-white hover:bg-[#0f3460] 
                     transition-colors first:rounded-t-lg last:rounded-b-lg
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                     focus-visible:outline-[#4ecdc4]"
          >
            🔗 คัดลอก URL
          </button>
          <button
            onClick={handleCopyShortUrl}
            disabled={isLoading}
            className="w-full px-4 py-3 text-left text-white hover:bg-[#0f3460] 
                     transition-colors first:rounded-t-lg last:rounded-b-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                     focus-visible:outline-[#4ecdc4]"
          >
            {isLoading ? '⏳ กำลังสร้าง...' : '✂️ สร้าง Short Link'}
          </button>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 
                       bg-[#4ecdc4] text-white font-bold rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Export from index**

**Files:**
- Modify: `components/planner/index.ts`

```typescript
export { SkillPlanner } from './SkillPlanner';
export { ScreenCapture } from './ScreenCapture';
export { CaptureCanvas } from './CaptureCanvas';
export { SkillSelection } from './SkillSelection';
export { ExportPreview } from './ExportPreview';
export { NameInput } from './NameInput';
export { ShareButton } from './ShareButton'; // Add this line
```

- [ ] **Step 3: Commit**

```bash
git add components/planner/ShareButton.tsx components/planner/index.ts
git commit -m "feat: add ShareButton component with URL copy"
```

---

## Chunk 5: Planner Page Integration

### Task 5.1: Update planner page to load shared builds

**Files:**
- Modify: `app/planner/page.tsx`

- [ ] **Step 1: Add hash loading on mount**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { SkillPlanner } from '@/components/planner';
import { decodeBuild, getHashFromUrl, isValidHash } from '@/lib/sharing';
import type { Skill } from '@/lib/types';

// Create a client-side wrapper that handles shared builds
export default function PlannerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState<{
    characterName: string;
    skills: Skill[];
  } | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const error = url.searchParams.get('error');

    if (error === 'not_found') {
      setLoadError('ไม่พบ build หรือหมดอายุ');
    }

    // Check for shared build in URL hash
    const hash = getHashFromUrl();

    if (hash && isValidHash(hash)) {
      const build = decodeBuild(hash);

      if (build) {
        const skills: Skill[] = build.s.map((image, index) => ({
          id: Date.now() + index,
          image,
          name: `สกิล ${index + 1}`,
        }));

        setInitialState({
          characterName: build.n,
          skills,
        });
      } else {
        setLoadError('โหลด build ไม่สำเร็จ: ข้อมูลเสียหาย');
      }
    } else if (hash) {
      setLoadError('โหลด build ไม่สำเร็จ: URL ไม่ถูกต้อง');
    }

    setIsLoading(false);

    // Clear hash/query from URL after loading (for cleaner share)
    if (hash || error) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-[#ffd700] text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return <SkillPlanner initialState={initialState} loadError={loadError} />;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/planner/page.tsx
git commit -m "feat: add shared build loading on page mount"
```

---

### Task 5.2: Update SkillPlanner to hydrate from shared state

**Files:**
- Modify: `components/planner/SkillPlanner.tsx`

- [ ] **Step 1: Accept shared initialState and loadError**

```typescript
interface SkillPlannerProps {
  initialState?: {
    characterName: string;
    skills: Skill[];
  } | null;
  loadError?: string | null;
}

export function SkillPlanner({ initialState, loadError }: SkillPlannerProps) {
  // ... existing code ...

  const [state, dispatch] = useReducer(reducer, {
    capturedImage: null,
    selectedSkills: initialState?.skills || [],
    characterName: initialState?.characterName || '',
    zoom: 1,
  });

  // When initialState arrives after mount, hydrate via reducer
  useEffect(() => {
    if (initialState) {
      dispatch({ type: 'hydrateFromShare', payload: initialState });
    }
  }, [initialState]);

  // Show load error toast
  useEffect(() => {
    if (loadError) {
      alert(loadError);
    }
  }, [loadError]);

  // ... rest of code ...
}
```

- [ ] **Step 2: Add reducer action to hydrate state**

```typescript
type Action =
  | { type: 'hydrateFromShare'; payload: { characterName: string; skills: Skill[] } }
  | ...;

case 'hydrateFromShare':
  return {
    ...state,
    capturedImage: null,
    selectedSkills: action.payload.skills,
    characterName: action.payload.characterName,
  };
```

- [ ] **Step 3: Commit**

```bash
git add components/planner/SkillPlanner.tsx
git commit -m "feat: hydrate planner from shared build"
```

---

## Chunk 6: Integration and Testing

### Task 6.1: Test full flow

- [ ] **Step 1: Test encode/decode roundtrip**
  - Select 10 skills
  - Click Share → Copy Full URL
  - Paste URL in new tab
  - Verify skills load correctly

- [ ] **Step 2: Test short URL flow**
  - Select skills
  - Click Share → Short Link
  - Copy the short URL
  - Paste in new tab
  - Verify redirect works

- [ ] **Step 3: Test error handling**
  - Visit invalid URL
  - Verify error message

- [ ] **Step 4: Commit final changes**

```bash
git add -A
git commit -m "feat: complete Phase 2 shareable build links"
```

---

## Testing Checklist

- [ ] Encode decode roundtrip (name + 10 skills)
- [ ] Copy full URL works
- [ ] Short URL API creates valid short ID
- [ ] Short URL redirect works
- [ ] Invalid hash shows error toast
- [ ] Expired short URL shows "not found"
- [ ] Works on mobile (share intent)
- [ ] Works on Safari/Firefox/Chrome

---

## Definition of Done

- [ ] All tasks completed and committed
- [ ] Manual testing passed on all browsers
- [ ] No TypeScript errors
- [ ] Build passes
- [ ] Docs updated
- [ ] CLAUDE.md updated
