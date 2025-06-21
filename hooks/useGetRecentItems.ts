import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useGetUserClothing } from './useClothing';

export function useGetRecentItems(limit = 5) {
  const { user } = useAuth();
  const { data: clothingItems, isLoading } = useGetUserClothing(user?.uid);

  const recentItems = useMemo(() => {
    if (!clothingItems) {
      return [];
    }
    return clothingItems.slice(0, limit).map((item) => ({
      id: item.id,
      name: item.name,
      image: item.imageUrl,
    }));
  }, [clothingItems, limit]);

  return { recentItems, isLoading };
} 