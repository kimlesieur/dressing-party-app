import { useUserStatistics } from '@/hooks/useUserStatistics';
import * as LucideIcons from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function HomepageStatistics() {
  const { stats } = useUserStatistics();

  return (
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
  );
}

const styles = StyleSheet.create({
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
}); 