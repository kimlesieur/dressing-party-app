import { ClothingItem } from '@/types/firebase';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OptimizedImage } from './OptimizedImage';

interface ClothingCardProps {
  item: ClothingItem;
  viewMode: 'grid' | 'list';
}

const getColorHex = (colorName: string) => {
  const colors: { [key: string]: string } = {
    Noir: '#1F2937',
    Blanc: '#F9FAFB',
    Gris: '#9CA3AF',
    Rouge: '#EF4444',
    Bleu: '#3B82F6',
    Vert: '#10B981',
    Rose: '#EC4899',
    Beige: '#D97706',
    Marron: '#92400E',
    Jaune: '#F59E0B',
    Multicolore: '#8B5CF6',
  };
  return colors[colorName] || '#9CA3AF';
};

export function ClothingCard({ item, viewMode }: ClothingCardProps) {
  const router = useRouter();

  const onPress = () => {
    router.push(`/clothing/${item.id}`);
  };

  if (viewMode === 'grid') {
    return (
      <TouchableOpacity onPress={onPress} style={styles.gridItem}>
        <View style={styles.imageContainer}>
          <OptimizedImage uri={item.imageUrl} style={styles.gridItemImage} />
          <TouchableOpacity style={styles.favoriteButton}>
            <Heart size={16} color={'#9CA3AF'} fill={'transparent'} />
          </TouchableOpacity>
        </View>
        <View style={styles.gridItemInfo}>
          <Text style={styles.gridItemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.gridItemBrand}>{item.brand}</Text>
          <View style={styles.colorDots}>
            {item.colors.slice(0, 3).map((color, index) => (
              <View
                key={index}
                style={[
                  styles.colorDot,
                  { backgroundColor: getColorHex(color) },
                ]}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.listItem}>
      <OptimizedImage uri={item.imageUrl} style={styles.listItemImage} />
      <View style={styles.listItemInfo}>
        <Text style={styles.listItemName}>{item.name}</Text>
        <Text style={styles.listItemDetails}>
          {item.brand} • {item.type}
        </Text>
        <Text style={styles.listItemSeasons}>{item.seasons?.join(', ')}</Text>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart size={20} color={'#9CA3AF'} fill={'transparent'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  gridItemImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridItemInfo: {
    padding: 12,
  },
  gridItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  gridItemBrand: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  colorDots: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  listItemDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  listItemSeasons: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});
