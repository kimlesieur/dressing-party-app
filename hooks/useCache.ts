import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useMemo } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const useCache = <T>(key: string, durationMs: number) => {
  const get = useCallback(async (): Promise<T | null> => {
    try {
      const json = await AsyncStorage.getItem(key);
      if (!json) return null;

      const entry: CacheEntry<T> = JSON.parse(json);
      if (Date.now() - entry.timestamp > durationMs) {
        await AsyncStorage.removeItem(key); // Cache expired
        return null;
      }
      return entry.data;
    } catch (e) {
      console.warn(`Error reading cache for ${key}`, e);
      return null;
    }
  }, [key, durationMs]);

  const set = useCallback(
    async (data: T) => {
      try {
        const entry: CacheEntry<T> = { data, timestamp: Date.now() };
        await AsyncStorage.setItem(key, JSON.stringify(entry));
      } catch (e) {
        console.warn(`Error setting cache for ${key}`, e);
      }
    },
    [key],
  );

  const invalidate = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error invalidating cache for ${key}`, e);
    }
  }, [key]);

  return useMemo(() => ({ get, set, invalidate }), [get, set, invalidate]);
};
