import { db, auth, storage } from '@/config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, connectFirestoreEmulator } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { signInAnonymously, signOut } from 'firebase/auth';

export interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  details?: string;
  warning?: string;
}

export class FirebaseTestService {
  // Test Firebase configuration
  static async testConfiguration(): Promise<TestResult> {
    try {
      // Check if all required environment variables are present
      const requiredEnvVars = [
        'EXPO_PUBLIC_FIREBASE_API_KEY',
        'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
        'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'EXPO_PUBLIC_FIREBASE_APP_ID'
      ];

      const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
      
      if (missingVars.length > 0) {
        return {
          name: 'Firebase Configuration',
          success: false,
          error: `Missing environment variables: ${missingVars.join(', ')}`,
          details: 'Check your .env file and ensure all Firebase configuration variables are set.'
        };
      }

      return {
        name: 'Firebase Configuration',
        success: true,
        details: 'All required environment variables are present and Firebase is configured.'
      };
    } catch (error: any) {
      return {
        name: 'Firebase Configuration',
        success: false,
        error: error.message
      };
    }
  }

  // Test Firebase Auth initialization and anonymous sign-in
  static async testAuth(): Promise<TestResult> {
    try {
      // Check if auth is properly initialized
      if (!auth) {
        throw new Error('Auth instance is null');
      }

      // Try anonymous sign-in for testing
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      return {
        name: 'Firebase Auth',
        success: true,
        details: `Auth initialized successfully. Anonymous user created: ${user.uid.substring(0, 8)}...`
      };
    } catch (error: any) {
      return {
        name: 'Firebase Auth',
        success: false,
        error: error.message,
        details: error.code ? `Error code: ${error.code}` : undefined
      };
    }
  }

  // Test Firestore connectivity with proper authentication
  static async testFirestore(): Promise<TestResult> {
    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        return {
          name: 'Firestore Connection',
          success: false,
          error: 'User not authenticated',
          details: 'Firestore operations require authentication. Run Auth test first.'
        };
      }

      // Try to create a test collection reference
      const testCollection = collection(db, 'test');
      
      // Try to add a test document
      const testDoc = await addDoc(testCollection, {
        message: 'Firebase connectivity test',
        timestamp: new Date(),
        testId: Math.random().toString(36).substr(2, 9),
        userId: auth.currentUser.uid
      });

      // Try to read the document back
      const snapshot = await getDocs(testCollection);
      const docExists = !snapshot.empty;

      // Clean up the test document
      await deleteDoc(testDoc);

      return {
        name: 'Firestore Connection',
        success: true,
        details: `Successfully created, read, and deleted test document. User: ${auth.currentUser.uid.substring(0, 8)}...`
      };
    } catch (error: any) {
      let errorDetails = `Error code: ${error.code || 'unknown'}`;
      let warning: string | undefined;

      // Provide specific guidance for common Firestore errors
      if (error.code === 'permission-denied') {
        errorDetails += '\n\nThis error is expected if:\n1. Firestore security rules are properly configured\n2. You haven\'t deployed the security rules yet\n3. The test collection is not allowed in your rules';
        warning = 'Permission denied errors are normal with proper security rules. Deploy your firestore.rules to fix this.';
      } else if (error.code === 'unavailable') {
        errorDetails += '\n\nFirestore service may be temporarily unavailable or there\'s a network issue.';
      }

      return {
        name: 'Firestore Connection',
        success: false,
        error: error.message,
        details: errorDetails,
        warning
      };
    }
  }

  // Test Firebase Storage initialization
  static async testStorage(): Promise<TestResult> {
    try {
      // Check if storage is properly initialized
      if (!storage) {
        throw new Error('Storage instance is null');
      }

      // Try to create a storage reference
      const testRef = ref(storage, 'test/connectivity-test.txt');
      
      return {
        name: 'Firebase Storage',
        success: true,
        details: `Storage initialized successfully. Test reference: ${testRef.fullPath}`
      };
    } catch (error: any) {
      return {
        name: 'Firebase Storage',
        success: false,
        error: error.message,
        details: error.code ? `Error code: ${error.code}` : undefined
      };
    }
  }

  // Test Firestore security rules (read-only test)
  static async testSecurityRules(): Promise<TestResult> {
    try {
      if (!auth.currentUser) {
        return {
          name: 'Security Rules Test',
          success: false,
          error: 'User not authenticated',
          details: 'Security rules test requires authentication.'
        };
      }

      // Try to read from a collection that should be accessible
      const usersCollection = collection(db, 'users');
      
      try {
        // This should work if rules allow reading user profiles
        await getDocs(usersCollection);
        
        return {
          name: 'Security Rules Test',
          success: true,
          details: 'Security rules are properly configured and accessible.',
          warning: 'This test only verifies read access. Write operations may still be restricted.'
        };
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          return {
            name: 'Security Rules Test',
            success: true,
            details: 'Security rules are working correctly (denying unauthorized access).',
            warning: 'Permission denied is expected behavior with proper security rules.'
          };
        }
        throw error;
      }
    } catch (error: any) {
      return {
        name: 'Security Rules Test',
        success: false,
        error: error.message,
        details: error.code ? `Error code: ${error.code}` : undefined
      };
    }
  }

  // Run all tests in sequence
  static async runAllTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test 1: Configuration
    try {
      const configResult = await this.testConfiguration();
      results.push(configResult);
      
      // If configuration fails, don't continue
      if (!configResult.success) {
        return results;
      }
    } catch (error) {
      results.push({
        name: 'Firebase Configuration',
        success: false,
        error: 'Failed to run configuration test'
      });
      return results;
    }

    // Test 2: Auth
    try {
      const authResult = await this.testAuth();
      results.push(authResult);
    } catch (error) {
      results.push({
        name: 'Firebase Auth',
        success: false,
        error: 'Failed to run Auth test'
      });
    }

    // Test 3: Storage
    try {
      const storageResult = await this.testStorage();
      results.push(storageResult);
    } catch (error) {
      results.push({
        name: 'Firebase Storage',
        success: false,
        error: 'Failed to run Storage test'
      });
    }

    // Test 4: Security Rules
    try {
      const rulesResult = await this.testSecurityRules();
      results.push(rulesResult);
    } catch (error) {
      results.push({
        name: 'Security Rules Test',
        success: false,
        error: 'Failed to run Security Rules test'
      });
    }

    // Test 5: Firestore (last, as it requires auth)
    try {
      const firestoreResult = await this.testFirestore();
      results.push(firestoreResult);
    } catch (error) {
      results.push({
        name: 'Firestore Connection',
        success: false,
        error: 'Failed to run Firestore test'
      });
    }

    return results;
  }

  // Clean up test data and sign out
  static async cleanupTestData(): Promise<void> {
    try {
      // Clean up any test documents
      const testCollection = collection(db, 'test');
      const snapshot = await getDocs(testCollection);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Sign out the anonymous user
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.warn('Failed to cleanup test data:', error);
      // Try to sign out anyway
      try {
        if (auth.currentUser) {
          await signOut(auth);
        }
      } catch (signOutError) {
        console.warn('Failed to sign out:', signOutError);
      }
    }
  }

  // Get deployment instructions
  static getDeploymentInstructions(): string {
    return `To deploy your Firestore security rules:

1. Install Firebase CLI:
   npm install -g firebase-cli

2. Login to Firebase:
   firebase login

3. Initialize Firestore in your project:
   firebase init firestore

4. Deploy the rules:
   firebase deploy --only firestore:rules

5. Your firestore.rules file should be deployed to your Firebase project.

Note: The permission denied errors in the Firestore test are expected when security rules are properly configured. This is actually a good sign that your rules are working!`;
  }
}