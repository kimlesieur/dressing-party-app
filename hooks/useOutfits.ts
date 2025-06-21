import { OutfitService } from '@/services/outfits';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuth } from './useAuth';

const outfitKeys = {
  all: ['outfits'] as const,
  lists: () => [...outfitKeys.all, 'list'] as const,
  list: (userId: string) => [...outfitKeys.lists(), { userId }] as const,
  details: () => [...outfitKeys.all, 'detail'] as const,
  detail: (id: string) => [...outfitKeys.details(), id] as const,
};

export function useGetUserOutfits() {
  const { user } = useAuth();
  return useQuery({
    queryKey: outfitKeys.list(user?.uid || ''),
    queryFn: () => OutfitService.getUserOutfits(user?.uid || ''),
    enabled: !!user,
  });
}

export function useGetOutfit(outfitId: string) {
  return useQuery({
    queryKey: outfitKeys.detail(outfitId),
    queryFn: () => OutfitService.getOutfit(outfitId),
    enabled: !!outfitId,
  });
}

export function useGetRandomUserOutfits(count: number) {
    const { data: outfits, ...queryInfo } = useGetUserOutfits();
  
    const randomOutfits = useMemo(() => {
      if (!outfits || outfits.length === 0) {
        return [];
      }
      const shuffled = [...outfits].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }, [outfits, count]);
  
    return {
      ...queryInfo,
      data: randomOutfits,
    };
} 