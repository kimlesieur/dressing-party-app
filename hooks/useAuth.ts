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
      console.log('[Auth] onAuthStateChanged =>', firebaseUser);
      if (!isMountedRef.current) return;

      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const profile = await AuthService.getCurrentUserProfile(
            firebaseUser.uid,
          );
          if (isMountedRef.current) {
            if (profile) {
              setUserProfile(profile);
            } else {
              // Profile missing, sign out
              await AuthService.signOut();
              setUserProfile(null);
              setUser(null);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          if (isMountedRef.current) {
            // On error, sign out
            await AuthService.signOut();
            setUserProfile(null);
            setUser(null);
            return;
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
          if (profile) {
            setUserProfile(profile);
          } else {
            // Profile missing, sign out
            AuthService.signOut();
            setUserProfile(null);
            setUser(null);
          }
        })
        .catch((error) => {
          console.error('Error refreshing user profile:', error);
          // On error, sign out
          AuthService.signOut();
          setUserProfile(null);
          setUser(null);
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
