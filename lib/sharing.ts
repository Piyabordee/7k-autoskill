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