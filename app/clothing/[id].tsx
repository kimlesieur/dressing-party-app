import { ClothingService } from '@/services/clothing';
import { ClothingItem } from '@/types/firebase';
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClothingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [clothingItem, setClothingItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    ClothingService.getClothingItem(id)
      .then(item => {
        if (item) {
          setClothingItem(item);
        } else {
          setError('Vêtement non trouvé.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Erreur lors de la récupération du vêtement.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (error || !clothingItem) {
    return <View style={styles.center}><Text>{error || 'Vêtement non trouvé'}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: clothingItem.name,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/clothing/edit/${id}`)} style={{ marginRight: 15 }}>
              <Feather name="edit" size={24} color="black" />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView>
        <Image source={{ uri: clothingItem.imageUrl }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{clothingItem.name}</Text>
          <Text style={styles.brand}>{clothingItem.brand}</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Couleurs</Text>
            <View style={styles.pillsContainer}>
              {clothingItem.colors.map(color => <Text key={color} style={styles.pill}>{color}</Text>)}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saisons</Text>
            <View style={styles.pillsContainer}>
                {clothingItem.seasons.map(season => <Text key={season} style={styles.pill}>{season}</Text>)}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type</Text>
            <Text style={styles.value}>{clothingItem.type}</Text>
          </View>
          {clothingItem.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.value}>{clothingItem.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    brand: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 20,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pill: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
        fontSize: 14,
        overflow: 'hidden'
    },
    value: {
        fontSize: 16,
    }
}); 