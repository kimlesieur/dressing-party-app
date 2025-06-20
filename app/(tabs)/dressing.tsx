import { ClothingCard } from '@/components/ClothingCard';
import { useAuth } from '@/hooks/useAuth';
import { useGetUserClothing } from '@/hooks/useClothing';
import { Grid2x2 as Grid, List, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DressingScreen() {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('Tous');
  
  const { data: clothes = [], isLoading, isError, error } = useGetUserClothing(user?.uid || '');

  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight.value],
      [0, -headerHeight.value],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }],
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: '#F8FAFC',
      paddingHorizontal: 20,
      paddingTop: insets.top,
    };
  });

  const spacerStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
    };
  });

  const filters = ['Tous', 'Hauts', 'Bas', 'Robes', 'Chaussures', 'Accessoires'];

  const filteredClothes = clothes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter =
      activeFilter === 'Tous' ||
      (activeFilter === 'Hauts' && item.type === 'tops') ||
      (activeFilter === 'Bas' && item.type === 'bottoms') ||
      (activeFilter === 'Robes' && item.type === 'dresses') ||
      (activeFilter === 'Chaussures' && item.type === 'shoes') ||
      (activeFilter === 'Accessoires' && item.type === 'accessories');
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={spacerStyle} />
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
        ) : isError ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Erreur</Text>
            <Text style={styles.emptyStateText}>{error?.message || 'Erreur lors du chargement des vêtements.'}</Text>
          </View>
        ) : (
          <>
            {filteredClothes.length > 0 ? (
              viewMode === 'grid' ? (
                <View style={styles.grid}>
                  {filteredClothes.map(item => <ClothingCard item={item} viewMode="grid" key={item.id} />)}
                </View>
              ) : (
                <View style={styles.list}>
                  {filteredClothes.map(item => <ClothingCard item={item} viewMode="list" key={item.id} />)}
                </View>
              )
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>Aucun vêtement trouvé</Text>
                <Text style={styles.emptyStateText}>
                  Essayez de modifier vos filtres ou ajoutez de nouveaux vêtements à votre dressing.
                </Text>
              </View>
            )}
          </>
        )}
      </Animated.ScrollView>

      <Animated.View 
        style={animatedHeaderStyle} 
        onLayout={(event) => {
          headerHeight.value = event.nativeEvent.layout.height;
        }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mon Dressing</Text>
          <Text style={styles.subtitle}>{filteredClothes.length} vêtements</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher dans ma garde-robe..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.viewToggle} onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List size={24} color="#8B5CF6" /> : <Grid size={24} color="#8B5CF6" />}
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={{ alignItems: 'center' }}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingBottom: 20,
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  viewToggle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersContainer: {
    marginBottom: 10,
    maxHeight: 40, // increased height
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8, // increased padding
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterChip: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 250,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});