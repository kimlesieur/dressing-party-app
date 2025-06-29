import { auth } from '@/config/firebase';
import { AuthService } from '@/services/auth';
import { UserProfile } from '@/types/firebase';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMountedRef.current) return;

      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const profile = await AuthService.getCurrentUserProfile(
            firebaseUser.uid,
          );
          if (isMountedRef.current) {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          if (isMountedRef.current) {
            setUserProfile(null);
          }
        }
      } else {
        if (isMountedRef.current) {
          setUserProfile(null);
        }
      }

      if (isMountedRef.current) {
        setLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await AuthService.signIn(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    username: string,
  ) => {
    try {
      const result = await AuthService.signUp(
        email,
        password,
        displayName,
        username,
      );
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      throw error;
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const downloadURL = await AuthService.uploadProfilePicture(
        user.uid,
        imageUri,
        userProfile?.avatar,
      );

      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          avatar: downloadURL,
          updatedAt: new Date(),
        });
      }

      return downloadURL;
    } catch (error) {
      throw error;
    }
  };

  const refreshUserProfile = useCallback(() => {
    if (user) {
      AuthService.getCurrentUserProfile(user.uid)
        .then((profile) => {
          setUserProfile(profile);
        })
        .catch((error) => {
          console.error('Error refreshing user profile:', error);
        });
    }
  }, [user]);

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    uploadProfilePicture,
    refreshUserProfile,
    isAuthenticated: !!user,
  };
}
