// Short link storage helper
// For now, use in-memory store (for development/demo)
// In production, replace with actual Vercel KV:
// import { kv } from '@vercel/kv';

const KEY_PREFIX = 'share:';
const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

// In-memory store for development
// Note: Data will be lost on server restart
const memoryStore = new Map<string, { hash: string; expiresAt: number }>();

export async function storeHash(id: string, hash: string): Promise<void> {
  const expiresAt = Date.now() + TTL_SECONDS * 1000;
  memoryStore.set(`${KEY_PREFIX}${id}`, { hash, expiresAt });
}

export async function getHash(id: string): Promise<string | null> {
  const entry = memoryStore.get(`${KEY_PREFIX}${id}`);
  if (!entry) return null;

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(`${KEY_PREFIX}${id}`);
    return null;
  }

  return entry.hash;
}

// Export TTL for use in API responses
export const SHORTLINK_TTL_SECONDS = TTL_SECONDS;