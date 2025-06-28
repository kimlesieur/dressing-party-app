import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Chrome as HomeIcon, Shirt, Users, User, Plus } from 'lucide-react-native';

const navItems = [
  { label: 'Accueil', route: '/', icon: HomeIcon },
  { label: 'Dressing', route: '/dressing', icon: Shirt },
  { label: 'Tenues', route: '/inspirations', icon: Users },
  { label: 'Profil', route: '/profile', icon: User },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo-transparent.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <Pressable
        onPress={() => router.push('/add')}
        style={styles.addButton}
      >
        <View style={styles.addButtonContent}>
          <Plus size={20} color="#fff" style={styles.addButtonIcon} />
          <Text style={styles.addButtonText}>Ajouter un vêtement</Text>
        </View>
      </Pressable>
      <View style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected =
            pathname === item.route ||
            pathname.startsWith(item.route + '/');
          return (
            <Pressable
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={[styles.navItem, isSelected && styles.navItemSelected]}
            >
              <View style={styles.iconTextRow}>
                <Icon size={20} color={isSelected ? '#fff' : '#8B5CF6'} style={styles.icon} />
                <Text style={[styles.navText, isSelected && styles.navTextSelected]}>
                  {item.label}
                </Text>
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
    width: 300,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    paddingVertical: 32,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    height: '100%',
    minHeight: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 160,
    height: 160,
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonIcon: {
    marginRight: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nav: {
    flex: 1,
  },
  navItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  navItemSelected: {
    backgroundColor: '#8B5CF6',
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  navText: {
    fontSize: 18,
    color: '#111827',
  },
  navTextSelected: {
    color: '#fff',
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