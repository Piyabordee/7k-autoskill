// Short link storage helper using Upstash Redis
import { Redis } from '@upstash/redis';

const KEY_PREFIX = 'share:';
const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Initialize Redis client
const redis = Redis.fromEnv();

export async function storeHash(id: string, hash: string): Promise<void> {
  await redis.set(`${KEY_PREFIX}${id}`, hash, { ex: TTL_SECONDS });
}

export async function getHash(id: string): Promise<string | null> {
  const hash = await redis.get<string>(`${KEY_PREFIX}${id}`);
  return hash;
}

// Export TTL for use in API responses
export const SHORTLINK_TTL_SECONDS = TTL_SECONDS;