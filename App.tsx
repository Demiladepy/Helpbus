import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AuthProvider } from './src/context/AuthContext';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    // Check if notifications are available (not supported in Expo Go on Android SDK 53+)
    const setupNotifications = async () => {
      try {
        // Try to get device push token to check if notifications are supported
        await Notifications.getDevicePushTokenAsync();
        console.log('App.tsx: Notifications are supported');

        // Request permissions for notifications
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permissions not granted');
        }

        // Set notification handler
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
      } catch (error) {
        console.log('App.tsx: Notifications not supported (likely Expo Go on Android SDK 53+):', error);
        // Notifications not available, skip setup
      }
    };

    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AccessibilityProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </AccessibilityProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}