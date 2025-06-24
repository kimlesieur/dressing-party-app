import AddButtonMenu from '@/components/AddButtonMenu';
import { Tabs, useRouter } from 'expo-router';
import {
  Chrome as Home,
  Plus,
  Shirt,
  User,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            height: Platform.OS === 'ios' ? 90 : 70,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="dressing"
          options={{
            title: 'Dressing',
            tabBarIcon: ({ size, color }) => (
              <Shirt size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarButton: (props) => (
              <Pressable
                onPress={() => router.push('/(tabs)/add')}
                onLongPress={() => setMenuVisible(true)}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={[
                    styles.addButton,
                    props.accessibilityState?.selected &&
                      styles.addButtonFocused,
                  ]}
                >
                  <Plus size={28} color="#FFFFFF" strokeWidth={3} />
                </View>
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="Inspirations"
          options={{
            title: 'Tenues',
            tabBarIcon: ({ size, color }) => (
              <Users size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="test"
          options={{
            href: null, // This hides the tab from the tab bar
          }}
        />
      </Tabs>
      <AddButtonMenu
        isOpen={isMenuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonFocused: {
    backgroundColor: '#7C3AED',
    transform: [{ scale: 1.1 }],
  },
});