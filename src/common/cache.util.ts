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

export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    const cached = apiCache.get(key) as T | undefined;
    if (cached !== undefined) {
      console.log('Cache hit for key:', key);
      return cached;
    }

    console.log('Cache miss for key:', key);
    const result = await fn();
    
    if (result === undefined || result === null) {
      console.warn('Attempted to cache null/undefined result for key:', key);
      throw new Error('Cannot cache null or undefined result');
    }

    apiCache.set(key, result);
    return result;
  } catch (error) {
    console.error('Cache error:', error);
    // On cache error, execute the function directly
    return fn();
  }
}