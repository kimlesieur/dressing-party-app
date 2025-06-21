import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useGetUserClothing } from './useClothing';

export function useUserStatistics() {
  const { user } = useAuth();
  const { data: clothingItems } = useGetUserClothing(user?.uid);

  const stats = useMemo(() => {
    if (!clothingItems || clothingItems.length === 0) {
      return {
        totalClothes: 0,
        outfitsCreated: 0, // This will be implemented later
        favoriteBrand: '-',
        dominantColor: '-',
      };
    }

    const brandCounts: { [key: string]: number } = {};
    const colorCounts: { [key: string]: number } = {};

    clothingItems.forEach(item => {
      // Brand
      if (item.brand) {
        brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
      }
      // Colors
      item.colors.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
    });

    const favoriteBrand = Object.keys(brandCounts).reduce((a, b) => brandCounts[a] > brandCounts[b] ? a : b, '-');
    const dominantColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b, '-');

    return {
      totalClothes: clothingItems.length,
      outfitsCreated: 8, // Mock data for now
      favoriteBrand,
      dominantColor,
    };
  }, [clothingItems]);

  return { stats };
} 