import { db } from '@/config/firebase';
import { Outfit } from '@/types/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export class OutfitService {
  // Create a new outfit
  static async createOutfit(
    userId: string,
    outfitData: Omit<
      Outfit,
      'id' | 'userId' | 'likes' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<Outfit> {
    try {
      const outfit = {
        ...outfitData,
        userId,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'outfits'), outfit);

      return {
        ...outfit,
        id: docRef.id,
      } as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      throw error;
    }
  }

  // Get a single outfit
  static async getOutfit(outfitId: string): Promise<Outfit | null> {
    try {
      const outfitRef = doc(db, 'outfits', outfitId);
      const docSnap = await getDoc(outfitRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Outfit;
      } else {
        console.log('No such outfit!');
        return null;
      }
    } catch (error) {
      console.error('Error getting outfit:', error);
      throw error;
    }
  }

  // Get user's outfits
  static async getUserOutfits(userId: string): Promise<Outfit[]> {
    try {
      const q = query(
        collection(db, 'outfits'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
      );

      const querySnapshot = await getDocs(q);
      const outfits: Outfit[] = [];

      querySnapshot.forEach((doc) => {
        outfits.push({
          id: doc.id,
          ...doc.data(),
        } as Outfit);
      });

      return outfits;
    } catch (error) {
      console.error('Error getting user outfits:', error);
      throw error;
    }
  }

  // Get public outfits for inspiration feed
  static async getPublicOutfits(): Promise<Outfit[]> {
    try {
      const q = query(
        collection(db, 'outfits'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
      );

      const querySnapshot = await getDocs(q);
      const outfits: Outfit[] = [];

      querySnapshot.forEach((doc) => {
        outfits.push({
          id: doc.id,
          ...doc.data(),
        } as Outfit);
      });

      return outfits;
    } catch (error) {
      console.error('Error getting public outfits:', error);
      throw error;
    }
  }

  // Like an outfit
  static async likeOutfit(outfitId: string): Promise<void> {
    try {
      const outfitRef = doc(db, 'outfits', outfitId);
      await updateDoc(outfitRef, {
        likes: increment(1),
      });
    } catch (error) {
      console.error('Error liking outfit:', error);
      throw error;
    }
  }

  // Unlike an outfit
  static async unlikeOutfit(outfitId: string): Promise<void> {
    try {
      const outfitRef = doc(db, 'outfits', outfitId);
      await updateDoc(outfitRef, {
        likes: increment(-1),
      });
    } catch (error) {
      console.error('Error unliking outfit:', error);
      throw error;
    }
  }

  // Update an outfit
  static async updateOutfit(
    outfitId: string,
    updates: Partial<Outfit>,
  ): Promise<void> {
    try {
      const outfitRef = doc(db, 'outfits', outfitId);
      await updateDoc(outfitRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating outfit:', error);
      throw error;
    }
  }

  // Delete an outfit
  static async deleteOutfit(outfitId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'outfits', outfitId));
    } catch (error) {
      console.error('Error deleting outfit:', error);
      throw error;
    }
  }
}
