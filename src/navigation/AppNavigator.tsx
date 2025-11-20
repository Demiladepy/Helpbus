import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { RootStackParamList, HomeStackParamList, BookingStackParamList, TripHistoryStackParamList, ProfileStackParamList, DriverStackParamList, Location, Ride } from '../types';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import TripScreen from '../screens/TripScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccessibilityScreen from '../screens/AccessibilityScreen';
import DriverDashboard from '../screens/DriverDashboard';
import DriverSettingsScreen from '../screens/DriverSettingsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import DriverSelectionScreen from '../screens/DriverSelectionScreen';
import { Ionicons } from '@expo/vector-icons';

// Param lists are defined in types/index.ts

const HomeStackNavigator = createNativeStackNavigator<HomeStackParamList>();
const BookingStackNavigator = createNativeStackNavigator<BookingStackParamList>();
const TripHistoryStackNavigator = createNativeStackNavigator<TripHistoryStackParamList>();
const ProfileStackNavigator = createNativeStackNavigator<ProfileStackParamList>();
const DriverStackNavigator = createNativeStackNavigator<DriverStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Home Stack
function HomeStack() {
  return (
    <HomeStackNavigator.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4F46E5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: true,
      }}
    >
      <HomeStackNavigator.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Mobility' }} />
      <HomeStackNavigator.Screen name="Accessibility" component={AccessibilityScreen} options={{ title: 'Accessibility Settings' }} />
    </HomeStackNavigator.Navigator>
  );
}

// Booking Stack
function BookingStack() {
  return (
    <BookingStackNavigator.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4F46E5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: true,
      }}
    >
      <BookingStackNavigator.Screen name="BookingMain" component={BookingScreen} options={{ title: 'Book a Ride' }} />
      <BookingStackNavigator.Screen name="DriverSelection" component={DriverSelectionScreen} options={{ title: 'Select Driver' }} />
      <BookingStackNavigator.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
      <BookingStackNavigator.Screen name="Trip" component={TripScreen} options={{ title: 'Your Trip', headerBackVisible: false }} />
    </BookingStackNavigator.Navigator>
  );
}

// Trip History Stack
function TripHistoryStack() {
  return (
    <TripHistoryStackNavigator.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4F46E5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: true,
      }}
    >
      <TripHistoryStackNavigator.Screen name="TripHistoryMain" component={TripHistoryScreen} options={{ title: 'Trip History' }} />
      <TripHistoryStackNavigator.Screen name="Trip" component={TripScreen} options={{ title: 'Your Trip', headerBackVisible: false }} />
    </TripHistoryStackNavigator.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <ProfileStackNavigator.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4F46E5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: true,
      }}
    >
      <ProfileStackNavigator.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile & Settings' }} />
      <ProfileStackNavigator.Screen name="Accessibility" component={AccessibilityScreen} options={{ title: 'Accessibility Settings' }} />
    </ProfileStackNavigator.Navigator>
  );
}

// Driver Stack
function DriverStack() {
  return (
    <DriverStackNavigator.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4F46E5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: true,
      }}
    >
      <DriverStackNavigator.Screen name="DriverDashboardMain" component={DriverDashboard} options={{ title: 'Driver Dashboard' }} />
      <DriverStackNavigator.Screen name="Trip" component={TripScreen} options={{ title: 'Current Trip', headerBackVisible: false }} />
      <DriverStackNavigator.Screen name="DriverSettings" component={DriverSettingsScreen} options={{ title: 'Driver Settings' }} />
    </DriverStackNavigator.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    // You could return a loading screen here
    return null;
  }

  const isDriver = user?.role === 'driver';

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator
          initialRouteName={isDriver ? "DriverDashboard" : "Home"}
          screenOptions={({ route }) => ({
             headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Booking') {
                iconName = 'car';
              } else if (route.name === 'DriverDashboard') {
                iconName = 'car-sport';
              } else if (route.name === 'TripHistory') {
                iconName = 'time';
              } else if (route.name === 'Profile') {
                iconName = 'settings';
              } else {
                iconName = 'help';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4F46E5',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: false,
          })}
        >
          {isDriver ? (
            <>
              <Tab.Screen name="DriverDashboard" component={DriverStack} />
              <Tab.Screen name="TripHistory" component={TripHistoryStack} />
              <Tab.Screen name="Profile" component={ProfileStack} />
            </>
          ) : (
            <>
              <Tab.Screen name="Home" component={HomeStack} />
              <Tab.Screen name="Booking" component={BookingStack} />
              <Tab.Screen name="TripHistory" component={TripHistoryStack} />
              <Tab.Screen name="Profile" component={ProfileStack} />
            </>
          )}
        </Tab.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}