import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import QueryClientProvider from "@/config/query/QueryClientProvider";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

function RootLayout() {
  useFrameworkReady();

  return (
    <QueryClientProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
};

export default RootLayout;