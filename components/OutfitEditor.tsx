import { OptimizedImage } from '@/components/OptimizedImage';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetClothingItemsByIds,
  useGetUserClothing,
} from '@/hooks/useClothing';
import { useGetOutfit } from '@/hooks/useOutfits';
import { OutfitService } from '@/services/outfits';
import { ClothingItem, Outfit } from '@/types/firebase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Updated clothing types to match your database structure
const CLOTHING_TYPES = [
  { id: 'all', name: 'Tous' },
  { id: 'tops', name: 'Hauts' },
  { id: 'bottoms', name: 'Bas' },
  { id: 'dresses', name: 'Robes' },
  { id: 'shoes', name: 'Chaussures' },
  { id: 'accessories', name: 'Accessoires' },
  { id: 'outerwear', name: 'Manteaux/Vestes' },
];

interface OutfitEditorProps {
  outfitId?: string;
}

export function OutfitEditor({ outfitId }: OutfitEditorProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: clothingItems, isLoading: isLoadingClothing } =
    useGetUserClothing(user?.uid || '');

  // Edit mode
  const { data: existingOutfit, isLoading: isLoadingOutfit } = useGetOutfit(
    outfitId || '',
  );

  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: initialSelectedItems } = useGetClothingItemsByIds(
    existingOutfit?.clothingItems || [],
  );

  useEffect(() => {
    if (existingOutfit) {
      setOutfitName(existingOutfit.name);
      if (initialSelectedItems) {
        setSelectedItems(initialSelectedItems);
      }
    }
  }, [existingOutfit, initialSelectedItems]);

  const handleSelectItem = (item: ClothingItem) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Fixed filter logic to match your database structure
  const filteredClothingItems = clothingItems?.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const createOutfitMutation = useMutation({
    mutationFn: (
      newOutfit: Omit<
        Outfit,
        'id' | 'userId' | 'likes' | 'createdAt' | 'updatedAt'
      >,
    ) => OutfitService.createOutfit(user?.uid || '', newOutfit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      Alert.alert('Succès', 'Tenue créée avec succès !');
      router.back();
    },
    onError: () =>
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création.'),
    onSettled: () => setIsSaving(false),
  });

  const updateOutfitMutation = useMutation({
    mutationFn: (updatedOutfit: {
      outfitId: string;
      updates: Partial<Outfit>;
    }) =>
      OutfitService.updateOutfit(updatedOutfit.outfitId, updatedOutfit.updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      queryClient.invalidateQueries({
        queryKey: ['outfits', 'detail', variables.outfitId],
      });
      Alert.alert('Succès', 'Tenue modifiée avec succès !');
      router.back();
    },
    onError: () =>
      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification.'),
    onSettled: () => setIsSaving(false),
  });

  const handleSaveOutfit = async () => {
    if (!outfitName.trim()) {
      Alert.alert('Erreur', 'Veuillez donner un nom à votre tenue.');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un vêtement.');
      return;
    }
    if (!user) return;

    setIsSaving(true);

    const outfitData = {
      name: outfitName,
      clothingItems: selectedItems.map((item) => item.id),
      imageUrl:
        selectedItems.length > 0
          ? selectedItems[0].imageUrl
          : existingOutfit?.imageUrl || undefined,
      isPublic: existingOutfit?.isPublic ?? false,
    };

    if (outfitId) {
      updateOutfitMutation.mutate({ outfitId, updates: outfitData });
    } else {
      createOutfitMutation.mutate(outfitData);
    }
  };

  if (isLoadingOutfit) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          style={{ marginTop: 50 }}
          size="large"
          color="#8B5CF6"
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.canvasSection}>
          <TextInput
            style={styles.outfitNameInput}
            placeholder="Nom de la tenue (ex: Look de bureau)"
            value={outfitName}
            onChangeText={setOutfitName}
          />
          <View style={styles.canvas}>
            {selectedItems.length === 0 ? (
              <View style={styles.canvasPlaceholder}>
                <LucideIcons.Shirt size={48} color="#CBD5E1" />
                <Text style={styles.canvasPlaceholderText}>
                  Vos vêtements sélectionnés apparaîtront ici.
                </Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.selectedItemsContainer}>
                  {selectedItems.map((item) => (
                    <View key={item.id} style={styles.selectedItem}>
                      <OptimizedImage
                        uri={item.imageUrl}
                        style={styles.selectedItemImage}
                      />
                      <TouchableOpacity
                        onPress={() => handleSelectItem(item)}
                        style={styles.removeItemButton}
                      >
                        <LucideIcons.X size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                      <Text style={styles.selectedItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>

        <View style={styles.clothingSection}>
          <Text style={styles.sectionTitle}>Votre dressing</Text>

          {/* Filter buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {CLOTHING_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.filterButton,
                  activeFilter === type.id && styles.activeFilter,
                ]}
                onPress={() => setActiveFilter(type.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === type.id && styles.activeFilterText,
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Clothing grid */}
          {isLoadingClothing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
          ) : filteredClothingItems && filteredClothingItems.length > 0 ? (
            <View>
              <View style={styles.clothingGrid}>
                {filteredClothingItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.clothingItem}
                    onPress={() => handleSelectItem(item)}
                  >
                    <OptimizedImage
                      uri={item.imageUrl}
                      style={styles.clothingItemImage}
                    />
                    {selectedItems.find((i) => i.id === item.id) && (
                      <View style={styles.clothingItemSelectedOverlay}>
                        <LucideIcons.Check size={24} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.clothingItemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <LucideIcons.Shirt size={48} color="#CBD5E1" />
              <Text style={styles.emptyStateText}>
                {activeFilter === 'all'
                  ? 'Aucun vêtement dans votre dressing'
                  : `Aucun ${CLOTHING_TYPES.find((t) => t.id === activeFilter)?.name.toLowerCase()} trouvé`}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {activeFilter === 'all'
                  ? 'Ajoutez des vêtements à votre dressing pour créer des tenues'
                  : 'Essayez un autre filtre ou ajoutez des vêtements de ce type'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.saveContainer}>
        <TouchableOpacity
          onPress={handleSaveOutfit}
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <LucideIcons.Check size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {outfitId ? 'Modifier la tenue' : 'Créer la tenue'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
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
  outfitNameInput: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  canvas: {
    minHeight: 140,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  canvasPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasPlaceholderText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  selectedItem: {
    marginHorizontal: 8,
    alignItems: 'center',
    width: 80,
  },
  selectedItemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedItemName: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    width: 70,
  },
  removeItemButton: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  clothingSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 20,
    height: 36, // Fixed height for the scroll container
  },
  filtersContent: {
    paddingRight: 20,
    alignItems: 'center', // Center align the buttons vertically
  },
  filterButton: {
    height: 32, // Fixed height for filter buttons
    paddingHorizontal: 16,
    paddingVertical: 0, // Remove vertical padding since we have fixed height
    borderRadius: 16, // Adjusted for the smaller height
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  activeFilter: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16, // Ensure consistent line height
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  clothingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
    gap: 8,
  },
  clothingItem: {
    width: '31%',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  clothingItemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  clothingItemName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  clothingItemSelectedOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 32,
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 250,
  },
  saveContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
