import { OptimizedImage } from '@/components/OptimizedImage';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useAuth } from '@/hooks/useAuth';
import { useGetClothingItem } from '@/hooks/useClothing';
import { useGetOutfit } from '@/hooks/useOutfits';
import { OutfitService } from '@/services/outfits';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function OutfitClothingItem({ id }: { id: string }) {
  const { data: clothingItem, isLoading } = useGetClothingItem(id);

  if (isLoading || !clothingItem) {
    return (
      <View style={styles.clothingItemContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.clothingItemContainer}>
      <OptimizedImage
        uri={clothingItem.imageUrl}
        style={styles.clothingItemImage}
      />
      <View style={styles.clothingItemDetails}>
        <Text style={styles.clothingItemName}>{clothingItem.name}</Text>
        <Text style={styles.clothingItemSub}>{clothingItem.type}</Text>
      </View>
    </View>
  );
}

export default function OutfitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: outfit, isLoading } = useGetOutfit(id || '');

  const deleteOutfitMutation = useMutation({
    mutationFn: (outfitId: string) => OutfitService.deleteOutfit(outfitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      Alert.alert('Succès', 'La tenue a été supprimée avec succès.', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/inspirations'),
        },
      ]);
    },
    onError: (error) => {
      console.error('Error deleting outfit:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la suppression. Veuillez réessayer.',
      );
    },
  });

  const handleDelete = () => {
    console.log('outfit =>', outfit);
    console.log('id =>', id);
    if (!outfit || !id) return;

    Alert.alert(
      'Supprimer la tenue',
      `Êtes-vous sûr de vouloir supprimer "${outfit.name}" ? Cette action est irréversible.`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteOutfitMutation.mutate(id);
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!outfit) {
    return (
      <View style={styles.centerContainer}>
        <Text>Tenue non trouvée.</Text>
      </View>
    );
  }

  // Check if current user owns this outfit
  const isOwner = user?.uid === outfit.userId;

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <LucideIcons.ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {outfit.name}
        </Text>
        <View style={styles.headerRightContainer}>
          {isOwner && (
            <>
              <Link href={`/outfits/edit/${id}`} asChild>
                <TouchableOpacity style={styles.editButton}>
                  <LucideIcons.FilePenLine size={22} color="#1F2937" />
                </TouchableOpacity>
              </Link>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
                disabled={deleteOutfitMutation.isPending}
              >
                {deleteOutfitMutation.isPending ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <LucideIcons.Trash2 size={22} color="#EF4444" />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <ScrollView>
        <OptimizedImage
          uri={outfit.imageUrl || ''}
          style={styles.outfitImage}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.outfitName}>{outfit.name}</Text>
          <Text style={styles.sectionTitle}>Vêtements de cette tenue</Text>
          {outfit.clothingItems.map((itemId) => (
            <OutfitClothingItem key={itemId} id={itemId} />
          ))}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  outfitImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 20,
  },
  outfitName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  clothingItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  clothingItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  clothingItemDetails: {
    flex: 1,
  },
  clothingItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clothingItemSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});