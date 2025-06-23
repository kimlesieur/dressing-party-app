import { ClothingService } from '@/services/clothing';
import { ClothingItem } from '@/types/firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const clothingKeys = {
  all: ['clothing'] as const,
  lists: () => [...clothingKeys.all, 'list'] as const,
  list: (userId: string) => [...clothingKeys.lists(), { userId }] as const,
  details: () => [...clothingKeys.all, 'detail'] as const,
  detail: (id: string) => [...clothingKeys.details(), id] as const,
  byIds: (ids: string[]) => [...clothingKeys.all, 'byIds', ids] as const,
};

export function useGetUserClothing(userId: string) {
  const queryClient = useQueryClient();
  const queryKey = clothingKeys.list(userId);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = ClothingService.subscribeToUserClothing(
      userId,
      (clothing) => {
        queryClient.setQueryData(queryKey, clothing);
      },
    );

    return () => unsubscribe();
  }, [userId, queryClient, queryKey]);

  return useQuery({
    queryKey,
    queryFn: () => ClothingService.getUserClothing(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });
}

export function useGetClothingItemsByIds(itemIds: string[]) {
  return useQuery({
    queryKey: clothingKeys.byIds(itemIds),
    queryFn: () => ClothingService.getClothingItemsByIds(itemIds),
    enabled: itemIds.length > 0,
  });
}

export function useGetClothingItem(id: string) {
  return useQuery({
    queryKey: clothingKeys.detail(id),
    queryFn: () => ClothingService.getClothingItem(id),
    enabled: !!id,
  });
}

export function useAddClothingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      clothingData,
      imageUri,
    }: {
      userId: string;
      clothingData: Omit<
        ClothingItem,
        'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imageUrl'
      >;
      imageUri: string;
    }) => ClothingService.addClothingItem(userId, clothingData, imageUri),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: clothingKeys.list(variables.userId),
      });
    },
    //? To invalidate cache
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: clothingKeys.list(userId) });
      const previousClothes = queryClient.getQueryData(
        clothingKeys.list(userId),
      );
      return { previousClothes };
    },
    onError: (err, { userId }, context) => {
      if (context?.previousClothes) {
        queryClient.setQueryData(
          clothingKeys.list(userId),
          context.previousClothes,
        );
      }
    },
  });
}

export function useUpdateClothingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      userId,
      updates,
      newImageUri,
    }: {
      itemId: string;
      userId: string;
      updates: Partial<
        Omit<
          ClothingItem,
          'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imageUrl'
        >
      >;
      newImageUri?: string;
    }) =>
      ClothingService.updateClothingItem(itemId, userId, updates, newImageUri),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: clothingKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: clothingKeys.detail(variables.itemId),
      });
    },
  });
}

export function useDeleteClothingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, imageUrl }: { itemId: string; imageUrl: string }) =>
      ClothingService.deleteClothingItem(itemId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clothingKeys.lists() });
    },
  });
}
