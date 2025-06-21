import { OptimizedImage } from '@/components/OptimizedImage';
import { useGetUserOutfits } from '@/hooks/useOutfits';
import { Outfit } from '@/types/firebase';
import { Link } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InspirationsScreen() {
  const { data: outfits, isLoading, refetch } = useGetUserOutfits();

  const renderItem = ({ item }: { item: Outfit }) => (
    <Link href={`/outfits/${item.id}`} asChild>
        <TouchableOpacity style={styles.outfitCard}>
            <OptimizedImage uri={item.imageUrl || ''} style={styles.outfitImage} />
            <View style={styles.outfitNameContainer}>
                <Text style={styles.outfitName} numberOfLines={2}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    </Link>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Tenues</Text>
        <Text style={styles.subtitle}>Retrouvez toutes vos créations</Text>
      </View>

      {outfits && outfits.length > 0 ? (
        <FlatList
          data={outfits}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      ) : (
        <View style={styles.centerContainer}>
            <LucideIcons.Shirt size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>Vous n&apos;avez pas encore créé de tenue.</Text>
            <Link href="/outfits/create" asChild>
                <TouchableOpacity style={styles.createButton}>
                    <Text style={styles.createButtonText}>Créer ma première tenue</Text>
                </TouchableOpacity>
            </Link>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
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
  list: {
    paddingHorizontal: 10,
  },
  outfitCard: {
    flex: 1,
    margin: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  outfitImage: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  outfitNameContainer: {
    padding: 12,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  createButton: {
    marginTop: 24,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  }
});