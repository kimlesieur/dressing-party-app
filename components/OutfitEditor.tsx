import { OptimizedImage } from '@/components/OptimizedImage';
import { useAuth } from '@/hooks/useAuth';
import {
  useGetClothingItemsByIds,
  useGetUserClothing,
} from '@/hooks/useClothing';
import { useGetOutfit } from '@/hooks/useOutfits';
import { OutfitService } from '@/services/outfits';
import { ClothingItem, Outfit } from '@/types/firebase';
import { useIsDesktop } from '@/utils/isDesktop';
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
  const isDesktop = useIsDesktop();
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

  if (isDesktop) {
    // Desktop Layout - Two Column Design
    return (
      <View style={styles.desktopContainer}>
        {/* Left Column - Outfit Canvas & Details */}
        <View style={styles.leftColumn}>
          <View style={styles.desktopCanvasSection}>
            <Text style={styles.desktopSectionTitle}>Votre Tenue</Text>
            <TextInput
              style={styles.desktopOutfitNameInput}
              placeholder="Nom de la tenue (ex: Look de bureau)"
              value={outfitName}
              onChangeText={setOutfitName}
            />
            
            <View style={styles.desktopCanvas}>
              {selectedItems.length === 0 ? (
                <View style={styles.desktopCanvasPlaceholder}>
                  <LucideIcons.Shirt size={64} color="#CBD5E1" />
                  <Text style={styles.desktopCanvasPlaceholderText}>
                    Sélectionnez des vêtements pour créer votre tenue
                  </Text>
                  <Text style={styles.desktopCanvasPlaceholderSubtext}>
                    Cliquez sur les vêtements de droite pour les ajouter
                  </Text>
                </View>
              ) : (
                <View style={styles.desktopSelectedItemsGrid}>
                  {selectedItems.map((item) => (
                    <View key={item.id} style={styles.desktopSelectedItem}>
                      <OptimizedImage
                        uri={item.imageUrl}
                        style={styles.desktopSelectedItemImage}
                      />
                      <TouchableOpacity
                        onPress={() => handleSelectItem(item)}
                        style={styles.desktopRemoveItemButton}
                      >
                        <LucideIcons.X size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                      <Text style={styles.desktopSelectedItemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveOutfit}
              style={[styles.desktopSaveButton, isSaving && styles.saveButtonDisabled]}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <LucideIcons.Check size={20} color="#FFFFFF" />
                  <Text style={styles.desktopSaveButtonText}>
                    {outfitId ? 'Modifier la tenue' : 'Créer la tenue'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Column - Clothing Selection */}
        <View style={styles.rightColumn}>
          <View style={styles.desktopClothingSection}>
            <Text style={styles.desktopSectionTitle}>Votre Dressing</Text>
            
            {/* Filter buttons */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.desktopFiltersContainer}
              contentContainerStyle={styles.desktopFiltersContent}
            >
              {CLOTHING_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.desktopFilterButton,
                    activeFilter === type.id && styles.desktopActiveFilter,
                  ]}
                  onPress={() => setActiveFilter(type.id)}
                >
                  <Text
                    style={[
                      styles.desktopFilterText,
                      activeFilter === type.id && styles.desktopActiveFilterText,
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
              <ScrollView style={styles.desktopClothingScrollView}>
                <View style={styles.desktopClothingGrid}>
                  {filteredClothingItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.desktopClothingItem}
                      onPress={() => handleSelectItem(item)}
                    >
                      <OptimizedImage
                        uri={item.imageUrl}
                        style={styles.desktopClothingItemImage}
                      />
                      {selectedItems.find((i) => i.id === item.id) && (
                        <View style={styles.desktopClothingItemSelectedOverlay}>
                          <LucideIcons.Check size={24} color="#FFFFFF" />
                        </View>
                      )}
                      <Text style={styles.desktopClothingItemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.desktopEmptyState}>
                <LucideIcons.Shirt size={48} color="#CBD5E1" />
                <Text style={styles.desktopEmptyStateText}>
                  {activeFilter === 'all'
                    ? 'Aucun vêtement dans votre dressing'
                    : `Aucun ${CLOTHING_TYPES.find((t) => t.id === activeFilter)?.name.toLowerCase()} trouvé`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Mobile Layout (unchanged)
  return (
    <View style={styles.container}>
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
          <View style={styles.clothingScrollView}>
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

  // Desktop Styles
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    gap: 32,
  },
  leftColumn: {
    flex: 1,
    maxWidth: 500,
  },
  rightColumn: {
    flex: 1.5,
  },
  desktopCanvasSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    height: 'fit-content',
  },
  desktopClothingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    height: '100%',
  },
  desktopSectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  desktopOutfitNameInput: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    fontSize: 18,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    color: '#1F2937',
    fontWeight: '500',
  },
  desktopCanvas: {
    minHeight: 400,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginBottom: 32,
  },
  desktopCanvasPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopCanvasPlaceholderText: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  desktopCanvasPlaceholderSubtext: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  desktopSelectedItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  desktopSelectedItem: {
    alignItems: 'center',
    width: 120,
    position: 'relative',
  },
  desktopSelectedItemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  desktopSelectedItemName: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  desktopRemoveItemButton: {
    position: 'absolute',
    top: -8,
    right: 10,
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  desktopSaveButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 20,
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
  desktopSaveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 12,
  },
  desktopFiltersContainer: {
    marginBottom: 24,
    height: 44,
  },
  desktopFiltersContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  desktopFilterButton: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopActiveFilter: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  desktopFilterText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 16,
  },
  desktopActiveFilterText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  desktopClothingScrollView: {
    flex: 1,
  },
  desktopClothingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 20,
  },
  desktopClothingItem: {
    width: 140,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  desktopClothingItemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  desktopClothingItemName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  desktopClothingItemSelectedOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 32,
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  desktopEmptyStateText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },

  // Mobile Styles (unchanged)
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
    height: 36,
  },
  filtersContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  filterButton: {
    height: 32,
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderRadius: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  clothingScrollView: {
    flex: 1,
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