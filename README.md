# Dressing Party

A React Native Expo app for managing your digital wardrobe, creating outfits, and sharing style inspiration.

## Features

- 📸 **Digital Wardrobe**: Photograph and catalog your clothing items
- 👗 **Outfit Creation**: Mix and match items to create outfits
- 🌟 **Style Inspiration**: Share and discover outfit ideas from the community
- 📊 **Style Analytics**: Track your wardrobe usage and style preferences
- 🔐 **User Profiles**: Personalized accounts with privacy controls

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Icons**: Lucide React Native
- **Styling**: React Native StyleSheet

## Firebase Setup

This app uses Firebase for backend services. To set up Firebase:

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
3. Get your Firebase configuration from Project Settings
4. Copy `.env.example` to `.env` and replace the mock values with your actual Firebase config:

```bash
cp .env.example .env
```

Then edit `.env` with your Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
EXPO_PUBLIC_REVENUECAT_API_KEY=api-key
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

The app uses the following environment variables (all prefixed with `EXPO_PUBLIC_` to be accessible in the client):

- `EXPO_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `EXPO_PUBLIC_FIREBASE_APP_ID` - Firebase app ID
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional)
- `EXPO_PUBLIC_REVENUECAT_API_KEY`- Revenue Cat API key

## Project Structure

```
app/
├── (tabs)/           # Tab-based navigation screens
├── _layout.tsx       # Root layout
└── +not-found.tsx    # 404 page

config/
└── firebase.ts       # Firebase configuration

services/
├── auth.ts          # Authentication service
├── clothing.ts      # Clothing management service
└── outfits.ts       # Outfit management service

types/
├── firebase.ts      # Firebase type definitions
└── env.d.ts         # Environment variable types

hooks/
└── useAuth.ts       # Authentication hook
```

## Development

- The app uses Expo managed workflow
- Firebase services are initialized in `config/firebase.ts`
- Authentication state is managed through the `useAuth` hook
- All Firebase operations are abstracted into service classes
- Environment variables are validated on app startup

## Security Notes

- Never commit your `.env` file to version control
- The `.env.example` file shows the required structure without sensitive data
- All environment variables use the `EXPO_PUBLIC_` prefix to be accessible in the client
- Firebase configuration is validated on app startup to catch missing credentials early

## Deployment

This app can be deployed using:
- Expo Application Services (EAS)
- Web deployment via Expo
- Native builds for iOS and Android

Make sure to configure your Firebase project for production and set the appropriate environment variables before deploying.