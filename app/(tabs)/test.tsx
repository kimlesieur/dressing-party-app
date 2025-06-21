import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FirebaseTestComponent from '@/components/FirebaseTestComponent';

export default function TestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FirebaseTestComponent />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
});