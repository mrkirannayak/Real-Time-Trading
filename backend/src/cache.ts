import { CacheEntry } from './types';

const cache = new Map<string, CacheEntry<unknown>>();
const TTL = 60000;

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttl: number = TTL): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl
  });
}

export function clearCache(key: string): void {
  cache.delete(key);
}

export function clearExpired(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
}

setInterval(clearExpired, TTL);
