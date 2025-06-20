import { OptimizedImage } from '@/components/OptimizedImage';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const todayWeather = {
    temperature: 22,
    condition: 'Ensoleillé',
    icon: '☀️'
  };

  const stats = {
    totalClothes: 52,
    outfitsCreated: 8,
    favoriteBrand: 'Zara',
    dominantColor: 'Bleu'
  };

  const recentItems = [
    { id: 1, name: 'Robe d\'été', image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 2, name: 'Blazer noir', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 3, name: 'Jean slim', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=300' },
  ];

  const suggestedOutfit = {
    name: 'Look Bureau Chic',
    items: ['Blazer noir', 'Jean slim', 'Chemise blanche'],
    image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour ! 👋</Text>
          <Text style={styles.subtitle}>Prête pour une journée stylée ?</Text>
        </View>

        {/* Weather Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#60A5FA', '#3B82F6']}
            style={styles.weatherGradient}
          >
            <View style={styles.weatherHeader}>
              <LucideIcons.Cloud size={24} color="#FFFFFF" />
              <Text style={styles.weatherTitle}>Météo du jour</Text>
            </View>
            <View style={styles.weatherContent}>
              <Text style={styles.weatherTemp}>{todayWeather.temperature}°C</Text>
              <Text style={styles.weatherCondition}>{todayWeather.condition}</Text>
            </View>
            <Text style={styles.weatherSuggestion}>
              Parfait pour une tenue légère et colorée !
            </Text>
          </LinearGradient>
        </View>

        {/* Suggested Outfit */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <LucideIcons.Star size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Tenue suggérée</Text>
          </View>
          <TouchableOpacity style={styles.outfitCard}>
            <OptimizedImage uri={suggestedOutfit.image} style={styles.outfitImage} />
            <View style={styles.outfitInfo}>
              <Text style={styles.outfitName}>{suggestedOutfit.name}</Text>
              <Text style={styles.outfitItems}>
                {suggestedOutfit.items.join(' • ')}
              </Text>
            </View>
            <LucideIcons.Heart size={24} color="#EC4899" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <LucideIcons.TrendingUp size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Mes statistiques</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalClothes}</Text>
              <Text style={styles.statLabel}>Vêtements</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.outfitsCreated}</Text>
              <Text style={styles.statLabel}>Tenues créées</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.favoriteBrand}</Text>
              <Text style={styles.statLabel}>Marque favorite</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.dominantColor}</Text>
              <Text style={styles.statLabel}>Couleur dominante</Text>
            </View>
          </View>
        </View>

        {/* Recent Items */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <LucideIcons.Shirt size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Derniers ajouts</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentItems}>
            {recentItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.recentItem}>
                <OptimizedImage uri={item.image} style={styles.recentItemImage} />
                <Text style={styles.recentItemName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Link href="/add" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.actionGradient}
              >
                <LucideIcons.Plus size={24} color="#FFFFFF" />
                <Text style={styles.actionText}>Ajouter un vêtement</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#EC4899', '#DB2777']}
              style={styles.actionGradient}
            >
              <LucideIcons.Shirt size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Créer une tenue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
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
  card: {
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
  weatherGradient: {
    borderRadius: 12,
    padding: 16,
    margin: -20,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 12,
  },
  weatherCondition: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  weatherSuggestion: {
    fontSize: 14,
    color: '#E0E7FF',
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  outfitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  outfitImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  outfitInfo: {
    flex: 1,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  outfitItems: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  recentItems: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  recentItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  recentItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentItemName: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 80,
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});