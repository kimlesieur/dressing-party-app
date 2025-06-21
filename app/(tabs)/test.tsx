import FirebaseTestComponent from '@/components/FirebaseTestComponent';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenWrapper } from '@/components/ScreenWrapper';

function TestScreen() {
  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.content}>
        <FirebaseTestComponent />
      </View>
    </ScreenWrapper>
  );
}

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
});
