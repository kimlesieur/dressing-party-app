import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Share, Bookmark, TrendingUp, Users } from 'lucide-react-native';

export default function InspirationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  const inspirations = [
    {
      id: 1,
      user: {
        name: 'Emma Style',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        followers: 2345,
      },
      outfitName: 'Look Bureau Chic',
      description: 'Perfect pour une journée au bureau ! Blazer vintage chinée aux Puces + jean taille haute + escarpins nude. Simple mais efficace ✨',
      image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 127,
      comments: 23,
      timeAgo: '2h',
      tags: ['bureau', 'blazer', 'vintage', 'chic'],
    },
    {
      id: 2,
      user: {
        name: 'Sofia Fashion',
        avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100',
        followers: 5678,
      },
      outfitName: 'Tenue Décontractée Weekend',
      description: 'Look cozy pour le weekend ! Oversized sweater + mom jeans + baskets blanches. Confort et style réunis 🌿',
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 89,
      comments: 15,
      timeAgo: '4h',
      tags: ['weekend', 'cozy', 'décontracté'],
    },
    {
      id: 3,
      user: {
        name: 'Luna Wardrobe',
        avatar: 'https://images.pexels.com/photos/1547971/pexels-photo-1547971.jpeg?auto=compress&cs=tinysrgb&w=100',
        followers: 1234,
      },
      outfitName: 'Soirée Élégante',
      description: 'Pour une soirée spéciale 🌟 Robe midi noire + talons vernis + bijoux dorés. L\'élégance à la française !',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 156,
      comments: 31,
      timeAgo: '6h',
      tags: ['soirée', 'élégant', 'noir', 'chic'],
    },
    {
      id: 4,
      user: {
        name: 'Chloe Minimal',
        avatar: 'https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=100',
        followers: 3456,
      },
      outfitName: 'Style Minimaliste',
      description: 'Less is more 🤍 T-shirt blanc + pantalon beige + baskets épurées. La beauté de la simplicité.',
      image: 'https://images.pexels.com/photos/1852382/pexels-photo-1852382.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 203,
      comments: 18,
      timeAgo: '1j',
      tags: ['minimaliste', 'blanc', 'simple'],
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSave = (postId: number) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inspirations</Text>
          <Text style={styles.subtitle}>Découvrez les tendances</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <TrendingUp size={24} color="#8B5CF6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Users size={24} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <ScrollView 
        style={styles.feed}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {inspirations.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* User Header */}
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <Text style={styles.userStats}>
                    {post.user.followers.toLocaleString()} abonnés • {post.timeAgo}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text style={styles.followButton}>Suivre</Text>
              </TouchableOpacity>
            </View>

            {/* Outfit Image */}
            <Image source={{ uri: post.image }} style={styles.postImage} />

            {/* Post Actions */}
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleLike(post.id)}
                >
                  <Heart 
                    size={24} 
                    color={likedPosts.includes(post.id) ? '#EC4899' : '#6B7280'} 
                    fill={likedPosts.includes(post.id) ? '#EC4899' : 'transparent'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={24} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Share size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleSave(post.id)}>
                <Bookmark 
                  size={24} 
                  color={savedPosts.includes(post.id) ? '#8B5CF6' : '#6B7280'} 
                  fill={savedPosts.includes(post.id) ? '#8B5CF6' : 'transparent'} 
                />
              </TouchableOpacity>
            </View>

            {/* Post Info */}
            <View style={styles.postInfo}>
              <Text style={styles.likesCount}>
                {post.likes + (likedPosts.includes(post.id) ? 1 : 0)} j'aime
              </Text>
              <View style={styles.postContent}>
                <Text style={styles.outfitName}>{post.outfitName}</Text>
                <Text style={styles.postDescription}>{post.description}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewComments}>
                  Voir les {post.comments} commentaires
                </Text>
              </TouchableOpacity>
              
              {/* Tags */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        ))}

        {/* Load More */}
        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Voir plus d'inspirations</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feed: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  followButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  postImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  postInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  postContent: {
    marginBottom: 8,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  viewComments: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  tagsContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  loadMoreButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
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
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});