import QueryClientProvider from '@/config/query/QueryClientProvider';
import { useAuth } from '@/hooks/useAuth';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import Purchases from 'react-native-purchases';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function RootLayout() {
  useFrameworkReady();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Purchases.configure({
        apiKey: Constants.expoConfig?.extra?.revenuecat?.apiKeyIOS,
      });
    } else if (Platform.OS === 'android') {
      Purchases.configure({
        apiKey: Constants.expoConfig?.extra?.revenuecat?.apiKeyAndroid,
      });
    }
  }, []);

  // Show loading screen while checking authentication status
  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
        <StatusBar style="auto" />
        <Toast />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Protected screens for unauthenticated users only */}
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
          </Stack.Protected>

          {/* Protected screens for authenticated users only */}
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="clothing/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="clothing/edit/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="outfits/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="outfits/create"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="outfits/edit/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profile/aide-support"
              options={{ headerShown: false }}
            />
          </Stack.Protected>

          {/* Global screens accessible to all */}
          <Stack.Screen name="profile/cgu" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile/privacy"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});

export default RootLayout;
