import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BookingStackParamList, Driver } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import DriverCard from '../components/DriverCard';
import { FirebaseService } from '../services/firebaseService';
import { Ionicons } from '@expo/vector-icons';

type DriverSelectionScreenNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'DriverSelection'>;
type DriverSelectionScreenRouteProp = RouteProp<BookingStackParamList, 'DriverSelection'>;

interface Props {
  navigation: DriverSelectionScreenNavigationProp;
  route: DriverSelectionScreenRouteProp;
}

export default function DriverSelectionScreen({ navigation, route }: Props) {
  const { rideId, accessibilityOptions, fare, pickup, dropoff } = route.params;
  if (!rideId) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20 }]}>Error</Text>
        <Text>Ride ID is missing</Text>
      </View>
    );
  }
  const { getFontSize, getColor, highContrast } = useAccessibility();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const availableDrivers = await FirebaseService.getAvailableDrivers();
        // Filter drivers based on accessibility options
        let filteredDrivers = availableDrivers;
        if (accessibilityOptions && accessibilityOptions.length > 0) {
          filteredDrivers = availableDrivers.filter(driver => {
            const driverFeatures = driver.vehicle?.accessibilityFeatures || [];
            return accessibilityOptions.every(option => {
              if (option === 'either') return true; // 'either' means any entry side is acceptable
              return driverFeatures.includes(option);
            });
          });
        }
        setDrivers(filteredDrivers);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        Alert.alert('Error', 'Failed to load drivers');
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, [accessibilityOptions]);

  const handleSelectDriver = async (driver: Driver) => {
    setSelecting(driver.id);
    try {
      await FirebaseService.updateRideStatus(rideId, 'assigned');
      await FirebaseService.acceptRide(rideId, driver.id);
      // Send notification to the driver
      await FirebaseService.sendNotification({
        userId: driver.id,
        title: 'New Ride Request',
        body: 'You have been assigned a new ride.',
        type: 'ride_request',
        rideId,
      });
      Alert.alert('Success', `Driver ${driver.name} assigned successfully!`);
      navigation.navigate('Payment', { fare, pickup, dropoff, rideId, driverId: driver.id });
    } catch (error) {
      console.error('Error selecting driver:', error);
      Alert.alert('Error', 'Failed to assign driver');
    } finally {
      setSelecting(null);
    }
  };

  const renderDriver = ({ item }: { item: Driver }) => (
    <View style={[styles.driverItem, highContrast && styles.driverItemHighContrast]}>
      <DriverCard driver={item} />
      <View style={styles.featuresContainer}>
        <Text style={[styles.featuresTitle, { fontSize: getFontSize(14), color: getColor('#374151', '#000') }]}>
          Accessibility Features:
        </Text>
        <View style={styles.featuresList}>
          {(item.vehicle?.accessibilityFeatures || []).map(feature => (
            <View key={feature} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={[styles.featureText, { fontSize: getFontSize(12) }]}>{feature}</Text>
            </View>
          ))}
        </View>
        <View style={styles.onlineIndicator}>
          <Ionicons name="radio-button-on" size={12} color="#10B981" />
          <Text style={[styles.onlineText, { fontSize: getFontSize(12) }]}>Online</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.selectButton, selecting === item.id && styles.selectButtonDisabled]}
        onPress={() => handleSelectDriver(item)}
        disabled={selecting === item.id}
      >
        {selecting === item.id ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Text style={[styles.selectButtonText, { fontSize: getFontSize(16) }]}>Select Driver</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 16, fontSize: getFontSize(16) }}>Loading available drivers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: getFontSize(20) }]}>Select a Driver</Text>
      <Text style={[styles.subtitle, { fontSize: getFontSize(14) }]}>
        Available drivers
      </Text>
      {drivers.length > 0 ? (
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.id}
          renderItem={renderDriver}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noDriversContainer}>
          <Ionicons name="car" size={48} color="#9CA3AF" />
          <Text style={[styles.noDriversText, { fontSize: getFontSize(16) }]}>
            No drivers available matching your requirements.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { fontSize: getFontSize(16) }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  title: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  driverItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  driverItemHighContrast: {
    borderWidth: 2,
    borderColor: '#000',
  },
  featuresContainer: {
    marginTop: 12,
  },
  featuresTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featureText: {
    color: '#374151',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineText: {
    color: '#10B981',
    fontWeight: '600',
  },
  selectButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  selectButtonDisabled: {
    opacity: 0.5,
  },
  selectButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  noDriversContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDriversText: {
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 16,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});