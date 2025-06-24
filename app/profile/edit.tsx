import { OptimizedImage } from '@/components/OptimizedImage';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/auth';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Camera, Check, ChevronLeft, Image as ImageIcon, X } from 'lucide-react-native';
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

export default function EditProfileScreen() {
  const { userProfile, refreshUserProfile } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    userProfile?.avatar || null,
  );
  const [profileData, setProfileData] = useState({
    displayName: userProfile?.displayName || '',
    username: userProfile?.username || '',
    bio: userProfile?.bio || '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
      aspect: [1, 1],
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
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!profileData.displayName.trim() || !profileData.username.trim()) {
      Alert.alert(
        'Informations manquantes',
        'Veuillez remplir au minimum le nom et le nom d\'utilisateur.',
      );
      return;
    }

    if (!userProfile) {
      Alert.alert('Erreur', 'Profil utilisateur non trouvé.');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare updates
      const updates = {
        displayName: profileData.displayName.trim(),
        username: profileData.username.trim(),
        bio: profileData.bio.trim(),
      };

      // Update profile data first
      await AuthService.updateUserProfile(userProfile.uid, updates);

      // Upload new avatar if changed
      if (selectedImage && selectedImage !== userProfile.avatar) {
        await AuthService.uploadProfilePicture(
          userProfile.uid,
          selectedImage,
          userProfile.avatar,
        );
      }

      // Refresh user profile to get latest data
      await refreshUserProfile();

      // Navigate back immediately after successful save
      router.back();
      
      // Show success message after navigation
      setTimeout(() => {
        Alert.alert('Succès', 'Votre profil a été mis à jour !');
      }, 100);

    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier le profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Avatar Section */}
        <View style={styles.section}>
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
            <View style={styles.imageContainer}>
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Aucune photo</Text>
              </View>
            </View>
          )}
          
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
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom complet *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Marie Dupont"
              value={profileData.displayName}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, displayName: text }))
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom d'utilisateur *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: marie_style"
              value={profileData.username}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, username: text }))
              }
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Parlez-nous de votre style, vos inspirations..."
              value={profileData.bio}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, bio: text }))
              }
              multiline
              numberOfLines={4}
            />
          </View>
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
                <Text style={styles.saveButtonText}>Enregistrer</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSection: {
    padding: 20,
    paddingBottom: 10,
  },
  pageTitle: {
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
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
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
    height: 100,
    textAlignVertical: 'top',
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