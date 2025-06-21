import { useAuth } from '@/hooks/useAuth';
import { useGetUserClothing } from '@/hooks/useClothing';
import { OutfitService } from '@/services/outfits';
import { ClothingItem } from '@/types/firebase';
import { router } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CLOTHING_TYPES = ['Tous', 'Haut', 'Bas', 'Chaussures', 'Accessoire', 'Robe'];

export default function CreateOutfitScreen() {
  const { user } = useAuth();
  const { data: clothingItems, isLoading: isLoadingClothing } = useGetUserClothing(user?.uid || '');
  
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tous');

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

  const handleSaveOutfit = async () => {
    if (!outfitName.trim()) {
      Alert.alert('Erreur', 'Veuillez donner un nom à votre tenue.');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un vêtement.');
      return;
    }
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer une tenue.');
      return;
    }

    setIsSaving(true);
    try {
      await OutfitService.createOutfit(user.uid, {
        name: outfitName,
        clothingItems: selectedItems.map((item) => item.id),
        imageUrl: selectedItems.length > 0 ? selectedItems[0].imageUrl : undefined,
        isPublic: false, // Default to private
      });
      Alert.alert('Succès', 'Tenue enregistrée avec succès !');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <LucideIcons.ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Créer une tenue</Text>
        <TouchableOpacity onPress={handleSaveOutfit} style={styles.saveButton} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveButtonText}>Sauvegarder</Text>}
        </TouchableOpacity>
      </View>
      
      <ScrollView>
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
                    <Image source={{ uri: item.imageUrl }} style={styles.selectedItemImage} />
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
                  <Image source={{ uri: item.imageUrl }} style={styles.clothingItemImage} />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    saveButton: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
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
    }
}); 