import { HomepageStatistics } from '@/components/HomepageStatistics';
import { OptimizedImage } from '@/components/OptimizedImage';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useGetRecentItems } from '@/hooks/useGetRecentItems';
import { useGetRandomUserOutfits } from '@/hooks/useOutfits';
import { useWeather } from '@/hooks/useWeather';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { recentItems } = useGetRecentItems();
  const {
    weather,
    isLoading: isLoadingWeather,
    error: weatherError,
    refreshWeather,
  } = useWeather();
  const { data: randomOutfits, isLoading: isLoadingOutfits } =
    useGetRandomUserOutfits(3);

  // Weather suggestion based on temperature
  const getWeatherSuggestion = (temp: number) => {
    if (temp < 10) return 'Parfait pour une tenue chaude et confortable !';
    if (temp < 20) return 'Idéal pour une tenue à manches longues !';
    if (temp < 25) return 'Parfait pour une tenue légère et colorée !';
    return 'Optez pour des vêtements légers et aérés !';
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour ! 👋</Text>
          <Text style={styles.subtitle}>Prêt pour une journée stylée ?</Text>
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
              <TouchableOpacity
                onPress={refreshWeather}
                style={styles.refreshButton}
              >
                <LucideIcons.RefreshCw size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {isLoadingWeather ? (
              <View style={styles.weatherContent}>
                <ActivityIndicator color="#FFFFFF" size="large" />
                <Text style={styles.weatherLoading}>
                  Chargement de la météo...
                </Text>
              </View>
            ) : weatherError ? (
              <View style={styles.weatherContent}>
                <LucideIcons.AlertCircle size={24} color="#FFFFFF" />
                <Text style={styles.weatherError}>
                  Impossible de charger la météo
                </Text>
              </View>
            ) : weather ? (
              <>
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherTemp}>
                    {weather.temperature}°C
                  </Text>
                  <Text style={styles.weatherCondition}>
                    {weather.condition}
                  </Text>
                </View>
                <Text style={styles.weatherSuggestion}>
                  {getWeatherSuggestion(weather.temperature)}
                </Text>
                <Text style={styles.weatherLocation}>📍 {weather.city}</Text>
              </>
            ) : null}
          </LinearGradient>
        </View>

        {/* Suggested Outfit */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <LucideIcons.Star size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Tenues suggérées</Text>
          </View>
          {isLoadingOutfits ? (
            <ActivityIndicator color="#8B5CF6" />
          ) : randomOutfits && randomOutfits.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestedOutfitsContainer}
            >
              {randomOutfits.map((outfit) => (
                <Link href={`/outfits/${outfit.id}`} asChild key={outfit.id}>
                  <TouchableOpacity style={styles.outfitCard}>
                    <OptimizedImage
                      uri={outfit.imageUrl || ''}
                      style={styles.outfitImage}
                    />
                    <View style={styles.outfitInfo}>
                      <Text style={styles.outfitName}>{outfit.name}</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noOutfitsText}>
              Aucune tenue suggérée pour le moment. Créez-en une !
            </Text>
          )}
        </View>

        <HomepageStatistics />

        {/* Recent Items */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <LucideIcons.Shirt size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Derniers ajouts</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recentItems}
          >
            {recentItems.map((item) => (
              <Link href={`/clothing/${item.id}`} asChild key={item.id}>
                <TouchableOpacity style={styles.recentItem}>
                  <OptimizedImage
                    uri={item.image}
                    style={styles.recentItemImage}
                  />
                  <Text style={styles.recentItemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </Link>
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
          <Link href="/outfits/create" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#EC4899', '#DB2777']}
                style={styles.actionGradient}
              >
                <LucideIcons.Shirt size={24} color="#FFFFFF" />
                <Text style={styles.actionText}>Créer une tenue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
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
    justifyContent: 'space-between',
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
    marginRight: 12,
    width: 280,
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
  suggestedOutfitsContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  noOutfitsText: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 20,
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
  weatherLoading: {
    fontSize: 14,
    color: '#E0E7FF',
    marginLeft: 8,
  },
  weatherError: {
    fontSize: 14,
    color: '#FEE2E2',
    marginLeft: 8,
  },
  refreshButton: {
    padding: 4,
  },
  weatherLocation: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 4,
  },
});
