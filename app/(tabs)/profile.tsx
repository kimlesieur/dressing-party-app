import { OptimizedImage } from '@/components/OptimizedImage';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { useAuth } from '@/hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import {
  ChartBar as BarChart3,
  Bell,
  Calendar,
  Camera,
  Crown,
  Heart,
  Circle as HelpCircle,
  LogIn,
  LogOut,
  Pencil,
  Settings,
  Share,
  Shield,
  Shirt,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PurchasesUI from 'react-native-purchases-ui';

export default function ProfileScreen() {
  const {
    userProfile,
    loading,
    signOut,
    isAuthenticated,
    uploadProfilePicture,
    refreshUserProfile,
  } = useAuth();
  const [isPublicProfile, setIsPublicProfile] = useState(
    userProfile?.isPublic ?? true,
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Refresh profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        refreshUserProfile();
      }
    }, [isAuthenticated, refreshUserProfile]),
  );

  // Show loading state
  if (loading) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated || !userProfile) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.authContent}>
            <Text style={styles.authTitle}>Welcome to Dressing Party</Text>
            <Text style={styles.authSubtitle}>
              Sign in to access your profile, manage your wardrobe, and share
              your style with the community.
            </Text>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <LogIn size={20} color="#FFFFFF" />
              <Text style={styles.loginButtonText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  const handleImagePicker = () => {
    Alert.alert(
      'Changer la photo de profil',
      'Choisissez une option',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Prendre une photo',
          onPress: openCamera,
        },
        {
          text: 'Choisir de la galerie',
          onPress: openImagePicker,
        },
      ],
      { cancelable: true },
    );
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à la caméra',
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile pictures
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Erreur', "Impossible d'ouvrir la caméra");
    }
  };

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile pictures
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening image picker:', error);
      Alert.alert('Erreur', "Impossible d'ouvrir la galerie");
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      setIsUploadingImage(true);
      await uploadProfilePicture(imageUri);
      Alert.alert('Succès', 'Photo de profil mise à jour !');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert(
        'Erreur',
        "Une erreur est survenue lors du téléchargement de l'image",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const stats = [
    { icon: Shirt, label: 'Vêtements', value: 52, color: '#8B5CF6' },
    { icon: Heart, label: 'Tenues créées', value: 18, color: '#EC4899' },
    { icon: Calendar, label: 'Jours actifs', value: 47, color: '#10B981' },
    { icon: Crown, label: 'Style score', value: 87, color: '#F59E0B' },
  ];

  const menuSections = [
    {
      title: 'Mon contenu',
      items: [
        {
          icon: Shirt,
          label: 'Mon dressing',
          action: () => router.push('/(tabs)/dressing'),
          color: '#8B5CF6',
        },
        {
          icon: Heart,
          label: 'Mes tenues favorites',
          action: () => router.push('/(tabs)/inspirations'),
          color: '#EC4899',
        },
        {
          icon: BarChart3,
          label: 'Mes statistiques',
          action: () => {},
          color: '#10B981',
        },
      ],
    },
    {
      title: 'Paramètres',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          action: () => {},
          color: '#F59E0B',
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: Shield,
          label: 'Profil public',
          action: () => {},
          color: '#6366F1',
          toggle: true,
          value: isPublicProfile,
          onToggle: setIsPublicProfile,
        },
        {
          icon: Settings,
          label: 'Paramètres généraux',
          action: () => {},
          color: '#6B7280',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Aide et support',
          action: () => {},
          color: '#8B5CF6',
        },
        {
          icon: Share,
          label: "Partager l'app",
          action: () => {},
          color: '#EC4899',
        },
      ],
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleShowPaywall = async () => {
    try {
      await PurchasesUI.presentPaywall();
    } catch (e: any) {
      Alert.alert('Erreur', "Impossible d'afficher le paywall", e);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <OptimizedImage
                uri={
                  userProfile.avatar ||
                  'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400'
                }
                style={styles.profileImage}
              />
            </View>
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handleImagePicker}
              disabled={isUploadingImage}
            >
              {isUploadingImage ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Camera size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{userProfile.displayName}</Text>
          <Text style={styles.profileUsername}>@{userProfile.username}</Text>

          <Text style={styles.profileBio}>
            {userProfile.bio ||
              'Ajouter une bio pour partager ton style avec le monde !'}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/profile/edit')}
            >
              <Pencil size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paywallButton}
              onPress={handleShowPaywall}
            >
              <Crown size={20} color="#FFFFFF" />
              <Text style={styles.paywallButtonText}>Voir le Paywall</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Mes statistiques</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: `${stat.color}15` },
                  ]}
                >
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statName}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 &&
                      styles.menuItemBorder,
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.menuItemLeft}>
                    <View
                      style={[
                        styles.menuIcon,
                        { backgroundColor: `${item.color}15` },
                      ]}
                    >
                      <item.icon size={20} color={item.color} />
                    </View>
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </View>
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#E5E7EB', true: `${item.color}40` }}
                      thumbColor={item.value ? item.color : '#F3F4F6'}
                    />
                  ) : (
                    <View style={styles.menuArrow}>
                      <Text style={styles.menuArrowText}>›</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        {/* Bolt.new Attribution */}
        <View style={styles.attributionSection}>
          <Text style={styles.attributionText}>Built with Bolt.new</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageWrapper: {
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    backgroundColor: '#fff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  paywallButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    marginLeft: 8,
  },
  paywallButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statName: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    borderRadius: 10,
    padding: 8,
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  menuArrow: {
    marginLeft: 8,
  },
  menuArrowText: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  attributionSection: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
  },
  attributionText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  authContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
