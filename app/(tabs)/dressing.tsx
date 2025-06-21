import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Grid2x2 as Grid, List, Heart, CreditCard as Edit } from 'lucide-react-native';

export default function DressingScreen() {
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filters = ['Tous', 'Hauts', 'Bas', 'Robes', 'Chaussures', 'Accessoires'];
  
  const clothes = [
    {
      id: 1,
      name: 'Robe d\'été fleurie',
      category: 'Robes',
      season: ['Printemps', 'Été'],
      colors: ['Rose', 'Blanc'],
      brand: 'Zara',
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
      favorite: true,
    },
    {
      id: 2,
      name: 'Blazer noir classique',
      category: 'Hauts',
      season: ['Automne', 'Hiver'],
      colors: ['Noir'],
      brand: 'Mango',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
      favorite: false,
    },
    {
      id: 3,
      name: 'Jean slim délavé',
      category: 'Bas',
      season: ['Toutes'],
      colors: ['Bleu'],
      brand: 'Levi\'s',
      image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
      favorite: true,
    },
    {
      id: 4,
      name: 'Chemise blanche',
      category: 'Hauts',
      season: ['Toutes'],
      colors: ['Blanc'],
      brand: 'Uniqlo',
      image: 'https://images.pexels.com/photos/1852382/pexels-photo-1852382.jpeg?auto=compress&cs=tinysrgb&w=400',
      favorite: false,
    },
    {
      id: 5,
      name: 'Escarpins nude',
      category: 'Chaussures',
      season: ['Printemps', 'Été'],
      colors: ['Beige'],
      brand: 'Zara',
      image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=400',
      favorite: true,
    },
    {
      id: 6,
      name: 'Pull en laine gris',
      category: 'Hauts',
      season: ['Automne', 'Hiver'],
      colors: ['Gris'],
      brand: 'H&M',
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400',
      favorite: false,
    },
  ];

  const filteredClothes = clothes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = activeFilter === 'Tous' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const renderGridItem = (item: typeof clothes[0]) => (
    <TouchableOpacity key={item.id} style={styles.gridItem}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.gridItemImage} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart 
            size={16} 
            color={item.favorite ? '#EC4899' : '#9CA3AF'} 
            fill={item.favorite ? '#EC4899' : 'transparent'} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.gridItemInfo}>
        <Text style={styles.gridItemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.gridItemBrand}>{item.brand}</Text>
        <View style={styles.colorDots}>
          {item.colors.slice(0, 3).map((color, index) => (
            <View 
              key={index} 
              style={[styles.colorDot, { backgroundColor: getColorHex(color) }]} 
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = (item: typeof clothes[0]) => (
    <TouchableOpacity key={item.id} style={styles.listItem}>
      <Image source={{ uri: item.image }} style={styles.listItemImage} />
      <View style={styles.listItemInfo}>
        <Text style={styles.listItemName}>{item.name}</Text>
        <Text style={styles.listItemDetails}>{item.brand} • {item.category}</Text>
        <Text style={styles.listItemSeasons}>{item.season.join(', ')}</Text>
      </View>
      <View style={styles.listItemActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart 
            size={20} 
            color={item.favorite ? '#EC4899' : '#9CA3AF'} 
            fill={item.favorite ? '#EC4899' : 'transparent'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Edit size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getColorHex = (colorName: string) => {
    const colors: { [key: string]: string } = {
      'Noir': '#1F2937',
      'Blanc': '#F9FAFB',
      'Gris': '#9CA3AF',
      'Rouge': '#EF4444',
      'Bleu': '#3B82F6',
      'Vert': '#10B981',
      'Rose': '#EC4899',
      'Beige': '#D97706',
      'Marron': '#92400E',
    };
    return colors[colorName] || '#9CA3AF';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mon Dressing</Text>
        <Text style={styles.subtitle}>{filteredClothes.length} vêtements</Text>
      </View>

      {/* Search Bar */}
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
        <TouchableOpacity style={styles.viewToggle}>
          {viewMode === 'grid' ? (
            <List size={24} color="#8B5CF6" onPress={() => setViewMode('list')} />
          ) : (
            <Grid size={24} color="#8B5CF6" onPress={() => setViewMode('grid')} />
          )}
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
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

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'grid' ? (
          <View style={styles.grid}>
            {filteredClothes.map(renderGridItem)}
          </View>
        ) : (
          <View style={styles.list}>
            {filteredClothes.map(renderListItem)}
          </View>
        )}
        
        {filteredClothes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Aucun vêtement trouvé</Text>
            <Text style={styles.emptyStateText}>
              Essayez de modifier vos filtres ou ajoutez de nouveaux vêtements à votre dressing.
            </Text>
          </View>
        )}
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  gridItemImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridItemInfo: {
    padding: 12,
  },
  gridItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  gridItemBrand: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  colorDots: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  list: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  listItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  listItemDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  listItemSeasons: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
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
});