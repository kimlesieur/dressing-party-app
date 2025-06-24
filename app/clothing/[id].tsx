import { OptimizedImage } from '@/components/OptimizedImage';
import { useAuth } from '@/hooks/useAuth';
import { useDeleteClothingItem, useGetClothingItem } from '@/hooks/useClothing';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ClothingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: clothingItem,
    isLoading,
    isError,
    error,
  } = useGetClothingItem(id ?? '');
  
  const deleteClothingMutation = useDeleteClothingItem();

  const handleDelete = () => {
    if (!clothingItem) return;

    Alert.alert(
      'Supprimer le vêtement',
      `Êtes-vous sûr de vouloir supprimer "${clothingItem.name}" ? Cette action est irréversible.`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteClothingMutation.mutate(
              {
                itemId: clothingItem.id,
                imageUrl: clothingItem.imageUrl,
              },
              {
                onSuccess: () => {
                  Alert.alert('Succès', 'Le vêtement a été supprimé avec succès.', [
                    {
                      text: 'OK',
                      onPress: () => router.push('/(tabs)/dressing'),
                    },
                  ]);
                },
                onError: (error) => {
                  console.error('Error deleting clothing item:', error);
                  Alert.alert(
                    'Erreur',
                    'Une erreur est survenue lors de la suppression. Veuillez réessayer.',
                  );
                },
              },
            );
          },
        },
      ],
    );
  };

  if (!id) {
    return (
      <View style={styles.center}>
        <Text>ID du vêtement manquant.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (isError || !clothingItem) {
    return (
      <View style={styles.center}>
        <Text>{error?.message || 'Vêtement non trouvé'}</Text>
      </View>
    );
  }

  // Check if current user owns this clothing item
  const isOwner = user?.uid === clothingItem.userId;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: clothingItem.name,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Feather name="chevron-left" size={24} color="#1F2937" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              {isOwner && (
                <>
                  <TouchableOpacity
                    onPress={() => router.push(`/clothing/edit/${id}`)}
                    style={styles.headerButton}
                  >
                    <Feather name="edit" size={22} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={[styles.headerButton]}
                    disabled={deleteClothingMutation.isPending}
                  >
                    {deleteClothingMutation.isPending ? (
                      <ActivityIndicator size="small" color="#EF4444" />
                    ) : (
                      <Trash2 size={22} color="#EF4444" />
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1F2937',
          },
          headerShadowVisible: true,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <OptimizedImage uri={clothingItem.imageUrl} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{clothingItem.name}</Text>
          {clothingItem.brand && (
            <Text style={styles.brand}>{clothingItem.brand}</Text>
          )}
          
          {clothingItem.colors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Couleurs</Text>
              <View style={styles.pillsContainer}>
                {clothingItem.colors.map((color) => (
                  <Text key={color} style={styles.pill}>
                    {color}
                  </Text>
                ))}
              </View>
            </View>
          )}
          
          {clothingItem.seasons.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saisons</Text>
              <View style={styles.pillsContainer}>
                {clothingItem.seasons.map((season) => (
                  <Text key={season} style={styles.pill}>
                    {season}
                  </Text>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type</Text>
            <Text style={styles.value}>{clothingItem.type}</Text>
          </View>
          
          {clothingItem.subCategory && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sous-catégorie</Text>
              <Text style={styles.value}>{clothingItem.subCategory}</Text>
            </View>
          )}
          
          {clothingItem.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.value}>{clothingItem.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  brand: {
    fontSize: 18,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  value: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});