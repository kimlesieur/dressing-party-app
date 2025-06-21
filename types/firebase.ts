// Firebase related types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ClothingItem {
  id: string;
  userId: string;
  name: string;
  type: string;
  subCategory?: string;
  seasons: string[];
  colors: string[];
  brand?: string;
  notes?: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  clothingItems: string[]; // Array of clothing item IDs
  imageUrl?: string;
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  bio?: string;
  avatar?: string;
  isPublic: boolean;
  followers: number;
  following: number;
  createdAt: Date;
  updatedAt: Date;
}