import { OptimizedImage } from '@/components/OptimizedImage';
import { useAuth } from '@/hooks/useAuth';
import { useGetClothingItemsByIds, useGetUserClothing } from '@/hooks/useClothing';
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

const CLOTHING_TYPES = ['Tous', 'Haut', 'Bas', 'Chaussures', 'Accessoire', 'Robe'];

interface OutfitEditorProps {
    outfitId?: string;
}

export function OutfitEditor({ outfitId }: OutfitEditorProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: clothingItems, isLoading: isLoadingClothing } = useGetUserClothing(user?.uid || '');
  
  // Edit mode
  const { data: existingOutfit, isLoading: isLoadingOutfit } = useGetOutfit(outfitId || '');

  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tous');

  const { data: initialSelectedItems } = useGetClothingItemsByIds(existingOutfit?.clothingItems || []);

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

  const filteredClothingItems = clothingItems?.filter(item => {
    if (activeFilter === 'Tous') return true;
    return item.type === activeFilter;
  });

  const createOutfitMutation = useMutation({
    mutationFn: (newOutfit: Omit<Outfit, 'id' | 'userId' | 'likes' | 'createdAt' | 'updatedAt'>) => OutfitService.createOutfit(user!.uid, newOutfit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      Alert.alert('Succès', 'Tenue créée avec succès !');
      router.back();
    },
    onError: () => Alert.alert('Erreur', "Une erreur est survenue lors de la création."),
    onSettled: () => setIsSaving(false),
  });

  const updateOutfitMutation = useMutation({
    mutationFn: (updatedOutfit: {outfitId: string, updates: Partial<Outfit>}) => OutfitService.updateOutfit(updatedOutfit.outfitId, updatedOutfit.updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      queryClient.invalidateQueries({ queryKey: ['outfits', 'detail', variables.outfitId] });
      Alert.alert('Succès', 'Tenue modifiée avec succès !');
      router.back();
    },
    onError: () => Alert.alert('Erreur', "Une erreur est survenue lors de la modification."),
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
        imageUrl: selectedItems.length > 0 ? selectedItems[0].imageUrl : (existingOutfit?.imageUrl || undefined),
        isPublic: existingOutfit?.isPublic ?? false,
    };

    if (outfitId) {
        updateOutfitMutation.mutate({ outfitId, updates: outfitData });
    } else {
        createOutfitMutation.mutate(outfitData);
    }
  };

  if (isLoadingOutfit) {
    return <ActivityIndicator style={{marginTop: 50}} size="large" />
  }

  return (
    <>
        <View style={styles.canvasSection}>
          <TextInput
            style={styles.outfitNameInput}
            placeholder="Nom de la tenue (ex: Look de bureau)"
            value={outfitName}
            onChangeText={setOutfitName}
          />
          <View style={styles.canvas}>
            {selectedItems.length === 0 ? (
              <Text style={styles.canvasPlaceholder}>Vos vêtements sélectionnés apparaîtront ici.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedItems.map(item => (
                  <View key={item.id} style={styles.selectedItem}>
                    <OptimizedImage uri={item.imageUrl} style={styles.selectedItemImage} />
                    <TouchableOpacity onPress={() => handleSelectItem(item)} style={styles.removeItemButton}>
                       <LucideIcons.X size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        
        <View style={styles.clothingSection}>
          <Text style={styles.sectionTitle}>Votre dressing</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            {CLOTHING_TYPES.map(type => (
                <TouchableOpacity 
                    key={type} 
                    style={[styles.filterButton, activeFilter === type && styles.activeFilter]}
                    onPress={() => setActiveFilter(type)}
                >
                    <Text style={[styles.filterText, activeFilter === type && styles.activeFilterText]}>{type}</Text>
                </TouchableOpacity>
            ))}
          </ScrollView>
          {isLoadingClothing ? (
            <ActivityIndicator size="large" color="#8B5CF6" />
          ) : (
            <View style={styles.clothingGrid}>
              {filteredClothingItems?.map(item => (
                <TouchableOpacity key={item.id} style={styles.clothingItem} onPress={() => handleSelectItem(item)}>
                  <OptimizedImage uri={item.imageUrl } style={styles.clothingItemImage} />
                  {selectedItems.find(i => i.id === item.id) && (
                    <View style={styles.clothingItemSelectedOverlay}>
                      <LucideIcons.Check size={24} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleSaveOutfit} style={styles.saveButton} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveButtonText}>Sauvegarder</Text>}
        </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
    canvasSection: {
        padding: 16,
    },
    outfitNameInput: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    canvas: {
        minHeight: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    canvasPlaceholder: {
        color: '#9CA3AF',
        textAlign: 'center',
    },
    selectedItem: {
        marginHorizontal: 5,
    },
    selectedItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeItemButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 2,
    },
    clothingSection: {
        paddingHorizontal: 16,
        flex: 1,
    },
    filtersContainer: {
        marginBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeFilter: {
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
    },
    filterText: {
        color: '#374151',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    clothingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    clothingItem: {
        width: '30%',
        aspectRatio: 1,
        position: 'relative',
    },
    clothingItemImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    clothingItemSelectedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#8B5CF6',
        padding: 16,
        borderRadius: 20,
        margin: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
}); 