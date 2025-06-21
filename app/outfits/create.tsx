import { OutfitEditor } from '@/components/OutfitEditor';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { router } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateOutfitScreen() {
  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <LucideIcons.ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Créer une tenue</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        <OutfitEditor />
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
});
