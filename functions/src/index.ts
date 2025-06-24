/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Storage } from '@google-cloud/storage';
import { logger } from 'firebase-functions/v2';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

import * as admin from 'firebase-admin';

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const storage = new Storage();

// Replace with your actual bucket name. You can find it in the Firebase Console
// under Storage > Files, it usually follows the pattern <project-id>.appspot.com
const BUCKET_NAME = 'dressingpartyproject.appspot.com';

interface CustomMetadata {
  createdAt: string;
}

// This function runs on a schedule, checking for old images to move
// to a cheaper storage class to save costs.
export const manageStorageClasses = onSchedule(
  {
    schedule: 'every 6 hours',
    maxInstances: 10,
    region: 'us-west1', // Explicitly set the region for v2
  },
  async () => {
    logger.info('Starting storage class management task.');

    try {
      const [files] = await storage.bucket(BUCKET_NAME).getFiles({
        prefix: 'clothing/',
      });

      const fifteenMinutesAgo = new Date();
      fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

      let filesProcessed = 0;
      let filesTransitioned = 0;

      for (const file of files) {
        filesProcessed++;
        const [metadata] = await file.getMetadata();
        const customMetadata = metadata.customMetadata as
          | CustomMetadata
          | undefined;

        // Check if the file is in STANDARD storage and has our custom metadata
        if (metadata.storageClass === 'STANDARD' && customMetadata?.createdAt) {
          const createdAt = new Date(customMetadata.createdAt);

          // If the file is older than 15 minutes, move it to COLDLINE
          if (createdAt < fifteenMinutesAgo) {
            logger.log(`Moving ${file.name} to COLDLINE storage.`);
            await file.setStorageClass('COLDLINE');
            filesTransitioned++;
          }
        }
      }

      logger.info(
        `Storage class management task finished. Processed ${filesProcessed} files and transitioned ${filesTransitioned} to COLDLINE.`,
      );
    } catch (error) {
      logger.error('Error during storage class management task:', error);
      // It's a good practice to re-throw the error for visibility
      // in Firebase's error reporting.
      throw error;
    }
  },
);

export const setUserRole = onDocumentWritten(
  {
    document: 'users/{userId}',
    region: 'us-west1',
  },
  async (event) => {
    const userId = event.params.userId;
    const userData = event.data?.after?.data();

    if (!userData || !userData.role) {
      // Optionally clear claims if user or role is deleted
      await admin.auth().setCustomUserClaims(userId, {});
      return;
    }

    try {
      await admin.auth().setCustomUserClaims(userId, { role: userData.role });
      console.log(
        `Custom claim 'role: ${userData.role}' set for user ${userId}`,
      );
    } catch (error) {
      console.error('Error setting custom claim:', error);
    }
  },
);
