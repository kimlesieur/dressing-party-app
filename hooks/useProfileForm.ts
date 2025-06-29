import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { z } from 'zod';

// Validation schema
const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  username: z
    .string()
    .min(1, "Le nom d'utilisateur est requis")
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(30, "Le nom d'utilisateur ne peut pas dépasser 30 caractères")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores"
    ),
  bio: z
    .string()
    .max(200, 'La bio ne peut pas dépasser 200 caractères')
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm() {
  const { userProfile, refreshUserProfile } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      username: '',
      bio: '',
    },
  });

  // Initialize form with user profile data
  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName || '',
        username: userProfile.username || '',
        bio: userProfile.bio || '',
      });
      setSelectedImage(userProfile.avatar || null);
    }
  }, [userProfile, form]);

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à la caméra'
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
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Erreur', "Impossible d'ouvrir la caméra");
    }
  };

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening image picker:', error);
      Alert.alert('Erreur', "Impossible d'ouvrir la galerie");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!userProfile) {
      Alert.alert('Erreur', 'Profil utilisateur non trouvé.');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare updates
      const updates = {
        displayName: data.displayName.trim(),
        username: data.username.trim(),
        bio: data.bio?.trim() || '',
      };

      // Update profile data first
      await AuthService.updateUserProfile(userProfile.uid, updates);

      // Upload new avatar if changed
      if (selectedImage && selectedImage !== userProfile.avatar) {
        await AuthService.uploadProfilePicture(
          userProfile.uid,
          selectedImage,
          userProfile.avatar
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
        'Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    selectedImage,
    isLoading,
    openCamera,
    openImagePicker,
    removeImage,
    handleSubmit,
    // Expose form state for easier access
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  };
}