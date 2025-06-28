import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Chrome as HomeIcon, Shirt, Users, User } from 'lucide-react-native';

const navItems = [
  { label: 'Accueil', route: '/', icon: HomeIcon },
  { label: 'Dressing', route: '/(tabs)/dressing', icon: Shirt },
  { label: 'Tenues', route: '/(tabs)/inspirations', icon: Users },
  { label: 'Profil', route: '/profile', icon: User },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>MonDressing</Text>
      <View style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable key={item.route} onPress={() => router.push(item.route as any)} style={styles.navItem}>
              <View style={styles.iconTextRow}>
                <Icon size={20} color="#8B5CF6" style={styles.icon} />
                <Text style={styles.navText}>{item.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.profile}>
        <Text style={styles.profileText}>Utilisateur</Text>
        <Text style={styles.profileLink}>Voir le profil</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    paddingVertical: 32,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    height: '100%',
    minHeight: 0,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#6366F1',
    marginBottom: 40,
  },
  nav: {
    flex: 1,
  },
  navItem: {
    paddingVertical: 16,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  navText: {
    fontSize: 16,
    color: '#111827',
  },
  profile: {
    marginTop: 40,
  },
  profileText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6B7280',
  },
  profileLink: {
    color: '#8B5CF6',
    fontSize: 14,
    marginTop: 4,
  },
}); 