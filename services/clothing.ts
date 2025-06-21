import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { ClothingItem } from '@/types/firebase';

export class ClothingService {
  // Add a new clothing item
  static async addClothingItem(
    userId: string, 
    clothingData: Omit<ClothingItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    imageFile: Blob
  ): Promise<ClothingItem> {
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `clothing/${userId}/${Date.now()}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Create clothing item document
      const clothingItem = {
        ...clothingData,
        userId,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'clothing'), clothingItem);
      
      return {
        ...clothingItem,
        id: docRef.id,
      } as ClothingItem;
    } catch (error) {
      console.error('Error adding clothing item:', error);
      throw error;
    }
  }

  // Get all clothing items for a user
  static async getUserClothing(userId: string): Promise<ClothingItem[]> {
    try {
      const q = query(
        collection(db, 'clothing'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const clothingItems: ClothingItem[] = [];
      
      querySnapshot.forEach((doc) => {
        clothingItems.push({
          id: doc.id,
          ...doc.data(),
        } as ClothingItem);
      });
      
      return clothingItems;
    } catch (error) {
      console.error('Error getting user clothing:', error);
      throw error;
    }
  }

  // Update a clothing item
  static async updateClothingItem(
    itemId: string, 
    updates: Partial<ClothingItem>
  ): Promise<void> {
    try {
      const itemRef = doc(db, 'clothing', itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating clothing item:', error);
      throw error;
    }
  }

  // Delete a clothing item
  static async deleteClothingItem(itemId: string, imageUrl: string): Promise<void> {
    try {
      // Delete the document
      await deleteDoc(doc(db, 'clothing', itemId));
      
      // Delete the image from storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting clothing item:', error);
      throw error;
    }
  }

  // Filter clothing items
  static filterClothing(
    items: ClothingItem[], 
    filters: {
      type?: string;
      season?: string;
      color?: string;
      brand?: string;
      search?: string;
    }
  ): ClothingItem[] {
    return items.filter(item => {
      if (filters.type && filters.type !== 'Tous' && item.type !== filters.type) {
        return false;
      }
      
      if (filters.season && !item.seasons.includes(filters.season)) {
        return false;
      }
      
      if (filters.color && !item.colors.includes(filters.color)) {
        return false;
      }
      
      if (filters.brand && item.brand?.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
      
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }
}