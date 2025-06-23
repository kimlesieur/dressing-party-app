import { db, storage } from '@/config/firebase';
import { ClothingItem } from '@/types/firebase';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

export class ClothingService {
  // Add a new clothing item
  static async addClothingItem(
    userId: string,
    clothingData: Omit<
      ClothingItem,
      'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imageUrl'
    >,
    imageUri: string,
  ): Promise<ClothingItem> {
    try {
      // Upload image to Firebase Storage
      const imageBlob = await this.compressAndResizeImage(imageUri);
      const imageRef = ref(storage, `clothing/${userId}/${Date.now()}`);

      const metadata = {
        customMetadata: {
          userId,
          createdAt: new Date().toISOString(),
          storageClass: 'STANDARD',
        },
      };

      const snapshot = await uploadBytes(imageRef, imageBlob, metadata);
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

  // Get a single clothing item by ID
  static async getClothingItem(itemId: string): Promise<ClothingItem | null> {
    try {
      const docRef = doc(db, 'clothing', itemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ClothingItem;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting clothing item details:', error);
      throw error;
    }
  }

  // Get multiple clothing items by their IDs
  static async getClothingItemsByIds(
    itemIds: string[],
  ): Promise<ClothingItem[]> {
    if (itemIds.length === 0) {
      return [];
    }
    try {
      const q = query(
        collection(db, 'clothing'),
        where('__name__', 'in', itemIds),
      );
      const querySnapshot = await getDocs(q);
      const clothingItems: ClothingItem[] = [];
      querySnapshot.forEach((doc) => {
        clothingItems.push({ id: doc.id, ...doc.data() } as ClothingItem);
      });
      return clothingItems;
    } catch (error) {
      console.error('Error getting clothing items by IDs:', error);
      throw error;
    }
  }

  // Get all clothing items for a user
  static async getUserClothing(userId: string): Promise<ClothingItem[]> {
    try {
      const q = query(
        collection(db, 'clothing'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
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

  // Get all clothing items for a user with real-time updates
  static subscribeToUserClothing(
    userId: string,
    onUpdate: (items: ClothingItem[]) => void,
  ): () => void {
    try {
      const q = query(
        collection(db, 'clothing'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const clothingItems: ClothingItem[] = [];
          querySnapshot.forEach((doc) => {
            clothingItems.push({
              id: doc.id,
              ...doc.data(),
            } as ClothingItem);
          });
          onUpdate(clothingItems);
        },
        (error) => {
          console.error('Error in clothing subscription:', error);
          // Maybe call onUpdate with an empty array or an error state
        },
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up user clothing subscription:', error);
      throw error;
    }
  }

  // Update a clothing item
  static async updateClothingItem(
    itemId: string,
    userId: string,
    updates: Partial<
      Omit<
        ClothingItem,
        'id' | 'userId' | 'createdAt' | 'updatedAt' | 'imageUrl'
      >
    >,
    newImageUri?: string,
  ): Promise<void> {
    try {
      const itemRef = doc(db, 'clothing', itemId);
      const updateData: any = { ...updates, updatedAt: new Date() };

      if (newImageUri) {
        // Delete old image if it exists
        const oldDocSnap = await getDoc(itemRef);
        if (oldDocSnap.exists()) {
          const oldData = oldDocSnap.data();
          if (oldData.imageUrl) {
            const oldImageRef = ref(storage, oldData.imageUrl);
            deleteObject(oldImageRef).catch((err) =>
              console.error('Error deleting old image:', err),
            );
          }
        }
        // Upload new image
        const imageBlob = await this.compressAndResizeImage(newImageUri);
        const imageRef = ref(storage, `clothing/${userId}/${Date.now()}`);

        const metadata = {
          customMetadata: {
            userId,
            createdAt: new Date().toISOString(),
            storageClass: 'STANDARD',
          },
        };

        const snapshot = await uploadBytes(imageRef, imageBlob, metadata);
        const imageUrl = await getDownloadURL(snapshot.ref);
        updateData.imageUrl = imageUrl;
      }

      await updateDoc(itemRef, updateData);
    } catch (error) {
      console.error('Error updating clothing item:', error);
      throw error;
    }
  }

  // Delete a clothing item
  static async deleteClothingItem(
    itemId: string,
    imageUrl: string,
  ): Promise<void> {
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
    },
  ): ClothingItem[] {
    return items.filter((item) => {
      if (
        filters.type &&
        filters.type !== 'Tous' &&
        item.type !== filters.type
      ) {
        return false;
      }

      if (filters.season && !item.seasons.includes(filters.season)) {
        return false;
      }

      if (filters.color && !item.colors.includes(filters.color)) {
        return false;
      }

      if (
        filters.brand &&
        item.brand?.toLowerCase() !== filters.brand.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.search &&
        !item.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }

  // Helper function to compress and resize images
  private static async compressAndResizeImage(imageUri: string): Promise<Blob> {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }], // Resize to max 800px width
      {
        compress: 0.7, // Compress image with 70% quality
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    const response = await fetch(result.uri);
    const blob = await response.blob();
    return blob;
  }
}
