import { ClothingService } from '@/services/clothing';
import { ClothingItem } from '@/types/firebase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const clothingKeys = {
  all: ['clothing'] as const,
  lists: () => [...clothingKeys.all, 'list'] as const,
  list: (userId: string) => [...clothingKeys.lists(), { userId }] as const,
  details: () => [...clothingKeys.all, 'detail'] as const,
  detail: (id: string) => [...clothingKeys.details(), id] as const,
};

export function useGetUserClothing(userId: string) {
  return useQuery({
    queryKey: clothingKeys.list(userId),
    queryFn: () => ClothingService.getUserClothing(userId),
    enabled: !!userId,
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
    mutationFn: ({ userId, clothingData, imageFile }: { userId: string; clothingData: Omit<ClothingItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imageUrl'>; imageFile: Blob }) => 
      ClothingService.addClothingItem(userId, clothingData, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clothingKeys.lists() });
    },
  });
}

export function useUpdateClothingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, userId, updates, newImageFile }: { itemId: string; userId: string; updates: Partial<Omit<ClothingItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imageUrl'>>; newImageFile?: Blob }) =>
      ClothingService.updateClothingItem(itemId, userId, updates, newImageFile),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: clothingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clothingKeys.detail(variables.itemId) });
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