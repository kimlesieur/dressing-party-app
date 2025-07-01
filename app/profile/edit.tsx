import { FormInput } from '@/components/FormInput';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useProfileForm } from '@/hooks/useProfileForm';
import { router } from 'expo-router';
import {
  Camera,
  Check,
  ChevronLeft,
  Image as ImageIcon,
  X,
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
const AppIcon = require('../../assets/images/icon.png');

export default function EditProfileScreen() {
  const {
    form,
    selectedImage,
    isLoading,
    openCamera,
    openImagePicker,
    removeImage,
    handleSubmit,
    errors,
  } = useProfileForm();

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
          <Text style={styles.sectionTitle}>Photo de profil</Text>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <OptimizedImage
                uri={selectedImage}
                style={styles.selectedImage}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <View style={styles.placeholderImage}>
                <Image
                  source={AppIcon}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  resizeMode="cover"
                />
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
              <Text style={styles.imageUploadText}>Choisir de la galerie</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <FormInput
            name="displayName"
            control={form.control}
            label="Nom complet"
            placeholder="Ex: Marie Dupont"
            error={errors.displayName?.message}
            required
          />

          <FormInput
            name="username"
            control={form.control}
            label="Nom d'utilisateur"
            placeholder="Ex: marie_style"
            error={errors.username?.message}
            autoCapitalize="none"
            required
          />

          <FormInput
            name="bio"
            control={form.control}
            label="Bio"
            placeholder="Parlez-nous de votre style, vos inspirations..."
            error={errors.bio?.message}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
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
