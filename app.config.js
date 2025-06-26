/* eslint-disable prettier/prettier */
export default ({ config }) => ({
    ...config,
    expo: {
        ...config.expo,
        name: 'Dressing Party',
        slug: 'dressing-party',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.kapps.dressingparty',
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                NSCameraUsageDescription:
                    "Cette application utilise la caméra pour prendre des photos de vos vêtements et les télécharger dans l'application.",
                NSLocationWhenInUseUsageDescription:
                    "Cette application utilise la localisation pour afficher la météo locale.",
            },
        },
        web: {
            bundler: 'metro',
            output: 'single',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            'expo-font',
            'expo-web-browser',
            [
                'expo-dev-client',
                {
                    launchMode: 'most-recent',
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {},
            eas: {
                projectId: '47b78a2e-7655-4a54-a8ab-1d451a75553e',
            },
            firebase: {
                apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
                measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
            },
        },
        owner: 'kimlesieur',
        android: {
            package: 'com.kimlesieur.dressingparty',
        },
    },
});
