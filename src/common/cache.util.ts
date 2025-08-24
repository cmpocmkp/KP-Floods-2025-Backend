import { LRUCache } from 'lru-cache';

const CACHE_TTL = 60 * 1000; // 60 seconds in milliseconds

export const apiCache = new LRUCache({
  max: 500, // Maximum number of items to store
  ttl: CACHE_TTL,
});

export function getCacheKey(path: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);

  return `${path}:${JSON.stringify(sortedParams)}`;
}

export function withCache<T>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
  const cached = apiCache.get<T>(key);
  if (cached !== undefined) {
    return Promise.resolve(cached);
  }

  return fn().then((result) => {
    apiCache.set(key, result);
    return result;
  });
}