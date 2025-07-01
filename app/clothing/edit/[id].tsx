import CustomToast from '@/components/CustomToast';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useAuth } from '@/hooks/useAuth';
import { useGetClothingItem, useUpdateClothingItem } from '@/hooks/useClothing';
import { ClothingItem } from '@/types/firebase';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Camera,
  ChevronLeft,
  Image as ImageIcon,
  X,
} from 'lucide-react-native';
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

type ClothingFormData = Omit<
  ClothingItem,
  'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imageUrl'
>;

export default function EditClothingScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: initialClothingItem,
    isLoading: isFetching,
    isError,
    error,
  } = useGetClothingItem(id ?? '');
  const updateClothingMutation = useUpdateClothingItem();

  const [clothingData, setClothingData] = useState<ClothingFormData | null>(
    null,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialClothingItem) {
      const { imageUrl, ...data } = initialClothingItem;
      setClothingData(data);
      setSelectedImage(imageUrl);
    }
  }, [initialClothingItem]);

  if (!id) {
    return (
      <View style={styles.centered}>
        <Text>ID du vêtement manquant.</Text>
      </View>
    );
  }

  if (isFetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>{error?.message || 'Erreur lors du chargement'}</Text>
      </View>
    );
  }

  if (!clothingData) {
    // This can happen briefly before the effect sets the state
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
      quality: 0.6,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.6,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleToggle = (field: 'seasons' | 'colors', value: string) => {
    setClothingData((prev) => {
      if (!prev) return null;
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSave = async () => {
    if (
      !clothingData ||
      !selectedImage ||
      !clothingData.name ||
      !clothingData.type
    ) {
      Alert.alert(
        'Informations manquantes',
        'Veuillez remplir tous les champs obligatoires.',
      );
      return;
    }
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté.');
      return;
    }

    // Only pass newImageUri if the user picked a new image (local file URI)
    const isLocalImage = selectedImage.startsWith('file://');

    updateClothingMutation.mutate(
      {
        itemId: id,
        userId: user.uid,
        updates: clothingData,
        newImageUri: isLocalImage ? selectedImage : undefined,
      },
      {
        onSuccess: () => {
          CustomToast.show({
            type: 'success',
            text1: 'Votre vêtement a été mis à jour !',
            text2: '',
          });
          router.push('/(tabs)/dressing');
        },
        onError: (err) => {
          console.error('Error updating clothing item:', err);
          CustomToast.show({
            type: 'error',
            text1: 'Erreur lors de la mise à jour du vêtement.',
            text2: '',
          });
        },
      },
    );
  };

  const selectedType = clothingTypes.find((t) => t.id === clothingData.type);

  return (
    <ScreenWrapper style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Modifier le vêtement',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color="#1F2937" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#F8FAFC',
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: '#1F2937',
          },
          headerShadowVisible: true,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo *</Text>
          {selectedImage && (
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
          )}
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={openCamera}
            >
              <Camera size={32} color="#8B5CF6" />
              <Text style={styles.imageUploadText}>Changer la photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={openImagePicker}
            >
              <ImageIcon size={32} color="#8B5CF6" />
              <Text style={styles.imageUploadText}>Choisir de la galerie</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de base</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom *</Text>
            <TextInput
              style={styles.textInput}
              value={clothingData.name}
              onChangeText={(text) =>
                setClothingData((p) => (p ? { ...p, name: text } : null))
              }
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Type *</Text>
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
                    setClothingData((p) =>
                      p ? { ...p, type: type.id, subCategory: '' } : null,
                    )
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
                      setClothingData((p) =>
                        p ? { ...p, subCategory: subCat } : null,
                      )
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
              value={clothingData.brand}
              onChangeText={(text) =>
                setClothingData((p) => (p ? { ...p, brand: text } : null))
              }
            />
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saisons</Text>
          <View style={styles.optionsContainer}>
            {seasons.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.optionChip,
                  clothingData.seasons.includes(s) && styles.selectedChip,
                ]}
                onPress={() => handleToggle('seasons', s)}
              >
                <Text
                  style={[
                    styles.optionText,
                    clothingData.seasons.includes(s) && styles.selectedText,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Couleurs</Text>
          <View style={styles.optionsContainer}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.optionChip,
                  clothingData.colors.includes(c) && styles.selectedChip,
                ]}
                onPress={() => handleToggle('colors', c)}
              >
                <Text
                  style={[
                    styles.optionText,
                    clothingData.colors.includes(c) && styles.selectedText,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Notes</Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={clothingData.notes}
            onChangeText={(text) =>
              setClothingData((p) => (p ? { ...p, notes: text } : null))
            }
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={updateClothingMutation.isPending}
        >
          {updateClothingMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  section: { margin: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  imageContainer: { position: 'relative', marginBottom: 10 },
  selectedImage: { width: '100%', height: 400, borderRadius: 12 },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 15,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageUploadButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  imageUploadText: { marginTop: 10, color: '#8B5CF6' },
  inputGroup: { marginBottom: 15 },
  inputLabel: { fontSize: 16, color: '#374151', marginBottom: 8 },
  textInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  optionsScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedChip: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  optionText: { color: '#374151' },
  selectedText: { color: 'white' },
  saveButton: {
    backgroundColor: '#8B5CF6',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
