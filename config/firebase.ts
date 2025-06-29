import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const fbConfig = Constants.expoConfig?.extra?.firebase;

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: fbConfig.apiKey,
  authDomain: fbConfig.authDomain,
  projectId: fbConfig.projectId,
  storageBucket: fbConfig.storageBucket,
  messagingSenderId: fbConfig.messagingSenderId,
  appId: fbConfig.appId,
  measurementId: fbConfig.measurementId,
};

// Validate that all required environment variables are present
// const requiredEnvVars = [
//   'EXPO_PUBLIC_FIREBASE_API_KEY',
//   'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
//   'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
//   'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
//   'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
//   'EXPO_PUBLIC_FIREBASE_APP_ID',
// ];

// const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

// if (missingEnvVars.length > 0) {
//   throw new Error(
//     `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}\n` +
//       'Please check your .env file and ensure all Firebase configuration variables are set.',
//   );
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth based on platform
export const auth = Platform.select({
  web: () => getAuth(app),
  default: () =>
    initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    }),
})();

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance
export default app;
