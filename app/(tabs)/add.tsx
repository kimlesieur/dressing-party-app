import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useAuth } from '@/hooks/useAuth';
import { ClothingService } from '@/services/clothing';
import { ClothingItem } from '@/types/firebase';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, Check, Image as ImageIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
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

import { OptimizedImage } from '@/components/OptimizedImage';

export default function AddClothingScreen() {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [clothingData, setClothingData] = useState<
    Omit<ClothingItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imageUrl'>
  >({
    name: '',
    type: '',
    subCategory: '',
    seasons: [],
    colors: [],
    brand: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const clothingTypes = [
    {
      id: 'tops',
      name: 'Hauts',
      subCategories: ['T-shirt', 'Chemise', 'Pull', 'Débardeur', 'Sweat'],
    },
    {
      id: 'bottoms',
      name: 'Bas',
      subCategories: ['Jean', 'Pantalon', 'Short', 'Jupe', 'Legging'],
    },
    {
      id: 'dresses',
      name: 'Robes',
      subCategories: ['Robe courte', 'Robe longue', 'Robe de soirée'],
    },
    {
      id: 'shoes',
      name: 'Chaussures',
      subCategories: ['Baskets', 'Escarpins', 'Boots', 'Sandales'],
    },
    {
      id: 'accessories',
      name: 'Accessoires',
      subCategories: ['Sac', 'Bijoux', 'Ceinture', 'Écharpe'],
    },
    {
      id: 'outerwear',
      name: 'Manteaux/Vestes',
      subCategories: ['Manteau', 'Veste', 'Blazer', 'Cardigan'],
    },
  ];

  const seasons = ['Printemps', 'Été', 'Automne', 'Hiver'];
  const colors = [
    'Noir',
    'Blanc',
    'Gris',
    'Rouge',
    'Bleu',
    'Vert',
    'Jaune',
    'Rose',
    'Beige',
    'Marron',
    'Multicolore',
  ];

  const getColorHex = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      Noir: '#1F2937',
      Blanc: '#F9FAFB',
      Gris: '#9CA3AF',
      Rouge: '#EF4444',
      Bleu: '#3B82F6',
      Vert: '#10B981',
      Jaune: '#F59E0B',
      Rose: '#EC4899',
      Beige: '#D97706',
      Marron: '#92400E',
      Multicolore: '#8B5CF6',
    };
    return colorMap[colorName] || '#9CA3AF';
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de votre permission pour accéder à la caméra',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSeasonToggle = (season: string) => {
    setClothingData((prev) => ({
      ...prev,
      seasons: prev.seasons.includes(season)
        ? prev.seasons.filter((s) => s !== season)
        : [...prev.seasons, season],
    }));
  };

  const handleColorToggle = (color: string) => {
    setClothingData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const convertImageToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const handleSave = async () => {
    if (!selectedImage || !clothingData.name || !clothingData.type) {
      Alert.alert(
        'Informations manquantes',
        'Veuillez ajouter au minimum une photo, un nom et un type de vêtement.',
      );
      return;
    }

    if (!user) {
      Alert.alert(
        'Erreur',
        'Vous devez être connecté pour ajouter un vêtement.',
      );
      return;
    }

    try {
      setIsLoading(true);

      // Convert image to blob
      const imageBlob = await convertImageToBlob(selectedImage);

      // Add clothing item - we pass clothingData directly as it already has the correct structure
      await ClothingService.addClothingItem(user.uid, clothingData, imageBlob);

      Alert.alert('Succès', 'Votre vêtement a été ajouté à votre dressing !', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedImage(null);
            setClothingData({
              name: '',
              type: '',
              subCategory: '',
              seasons: [],
              colors: [],
              brand: '',
              notes: '',
            });
            // Navigate back to dressing
            router.push('/(tabs)/dressing');
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding clothing item:', error);
      Alert.alert(
        'Erreur',
        "Une erreur est survenue lors de l'ajout du vêtement. Veuillez réessayer.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedType = clothingTypes.find((t) => t.id === clothingData.type);

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ajouter un vêtement</Text>
          <Text style={styles.subtitle}>Immortalisez votre style</Text>
        </View>

        {/* Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo du vêtement *</Text>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <OptimizedImage
                uri={selectedImage}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageUploadContainer}>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={openCamera}
              >
                <Camera size={32} color="#8B5CF6" />
                <Text style={styles.imageUploadText}>Prendre une photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={openImagePicker}
              >
                <ImageIcon size={32} color="#8B5CF6" />
                <Text style={styles.imageUploadText}>
                  Choisir de la galerie
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de base</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom du vêtement *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: T-shirt blanc Uniqlo"
              value={clothingData.name}
              onChangeText={(text) =>
                setClothingData((prev) => ({ ...prev, name: text }))
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Type de vêtement *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.optionsScroll}
            >
              {clothingTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.optionChip,
                    clothingData.type === type.id && styles.selectedChip,
                  ]}
                  onPress={() =>
                    setClothingData((prev) => ({
                      ...prev,
                      type: type.id,
                      subCategory: '',
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      clothingData.type === type.id && styles.selectedText,
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {selectedType && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sous-catégorie</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.optionsScroll}
              >
                {selectedType.subCategories.map((subCat) => (
                  <TouchableOpacity
                    key={subCat}
                    style={[
                      styles.optionChip,
                      clothingData.subCategory === subCat &&
                        styles.selectedChip,
                    ]}
                    onPress={() =>
                      setClothingData((prev) => ({
                        ...prev,
                        subCategory: subCat,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        clothingData.subCategory === subCat &&
                          styles.selectedText,
                      ]}
                    >
                      {subCat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Marque</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Zara, H&M, Uniqlo..."
              value={clothingData.brand}
              onChangeText={(text) =>
                setClothingData((prev) => ({ ...prev, brand: text }))
              }
            />
          </View>
        </View>

        {/* Seasons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saisons</Text>
          <View style={styles.optionsGrid}>
            {seasons.map((season) => (
              <TouchableOpacity
                key={season}
                style={[
                  styles.optionChip,
                  clothingData.seasons.includes(season) && styles.selectedChip,
                ]}
                onPress={() => handleSeasonToggle(season)}
              >
                <Text
                  style={[
                    styles.optionText,
                    clothingData.seasons.includes(season) &&
                      styles.selectedText,
                  ]}
                >
                  {season}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Colors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Couleurs</Text>
          <View style={styles.colorGrid}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorChip,
                  { backgroundColor: getColorHex(color) },
                  clothingData.colors.includes(color) &&
                    styles.selectedColorChip,
                ]}
                onPress={() => handleColorToggle(color)}
              >
                {clothingData.colors.includes(color) && (
                  <Check
                    size={16}
                    color={color === 'Blanc' ? '#1F2937' : '#FFFFFF'}
                  />
                )}
                <Text
                  style={[
                    styles.colorText,
                    { color: color === 'Blanc' ? '#1F2937' : '#FFFFFF' },
                  ]}
                >
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Ex: À porter avec le jean noir, reçu en cadeau..."
            value={clothingData.notes}
            onChangeText={(text) =>
              setClothingData((prev) => ({ ...prev, notes: text }))
            }
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Check size={24} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  Ajouter à mon dressing
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 250,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 4,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageUploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    width: '45%',
  },
  imageUploadText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedChip: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedColorChip: {
    borderColor: '#1F2937',
  },
  colorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  saveContainer: {
    padding: 20,
    paddingBottom: 40,
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
});
