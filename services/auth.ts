import { auth, db, storage } from '@/config/firebase';
import { UserProfile } from '@/types/firebase';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

export class AuthService {
  // Sign up with email and password
  static async signUp(
    email: string,
    password: string,
    displayName: string,
    username: string,
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName,
        username,
        bio: '',
        avatar: '',
        isPublic: true,
        followers: 0,
        following: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return { user, userProfile };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userProfile = userDoc.exists()
        ? (userDoc.data() as UserProfile)
        : null;

      return { user, userProfile };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user profile
  static async getCurrentUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(
        userRef,
        {
          ...updates,
          updatedAt: new Date(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(
    userId: string,
    imageUri: string,
    currentAvatarUrl?: string,
  ): Promise<string> {
    try {
      // Compress and resize image
      const compressedImage = await this.compressAndResizeImage(imageUri);

      // Create storage reference
      const imageRef = ref(storage, `avatars/${userId}/${Date.now()}`);

      // Upload metadata
      const metadata = {
        customMetadata: {
          userId,
          createdAt: new Date().toISOString(),
          storageClass: 'STANDARD',
        },
      };

      // Upload image
      const snapshot = await uploadBytes(imageRef, compressedImage, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Delete old avatar if it exists
      if (currentAvatarUrl) {
        try {
          const oldImageRef = ref(storage, currentAvatarUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn('Failed to delete old avatar:', error);
          // Don't throw error if old image deletion fails
        }
      }

      // Update user profile with new avatar URL
      await this.updateUserProfile(userId, { avatar: downloadURL });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Helper function to compress and resize images
  private static async compressAndResizeImage(imageUri: string): Promise<Blob> {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 400 } }], // Resize to 400px width for profile pictures
      {
        compress: 0.8, // Compress image with 80% quality
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    const response = await fetch(result.uri);
    const blob = await response.blob();
    return blob;
  }
}