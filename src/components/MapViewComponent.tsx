import React from 'react';
import { StyleSheet, View, Text, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Location } from '../types';

interface Props {
  pickup: Location | null;
  dropoff: Location | null;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  editable?: boolean;
  driverLocation?: Location;
  showRoute?: boolean;
  onPickupPress?: () => void;
  onDropoffPress?: () => void;
  onPickupDragEnd?: (coordinate: { latitude: number; longitude: number }) => void;
  onDropoffDragEnd?: (coordinate: { latitude: number; longitude: number }) => void;
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const { width, height } = Dimensions.get('window');

export default function MapViewComponent({
  pickup,
  dropoff,
  onMapPress,
  editable = true,
  driverLocation,
  showRoute = false,
  onPickupPress,
  onDropoffPress,
  onPickupDragEnd,
  onDropoffDragEnd,
  region,
}: Props) {
  // ✅ Default fallback region (Lagos for testing)
  const defaultRegion = {
    latitude: pickup?.latitude || 6.5244,
    longitude: pickup?.longitude || 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // ✅ Safe route drawing (only when both points are valid)
  const routeCoordinates =
    pickup &&
    dropoff &&
    showRoute &&
    typeof pickup.latitude === 'number' &&
    typeof pickup.longitude === 'number' &&
    typeof dropoff.latitude === 'number' &&
    typeof dropoff.longitude === 'number'
      ? [
          { latitude: pickup.latitude, longitude: pickup.longitude },
          { latitude: dropoff.latitude, longitude: dropoff.longitude },
        ]
      : [];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region || defaultRegion}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
        moveOnMarkerPress={false}
        onPress={(e) => onMapPress?.(e.nativeEvent.coordinate)}
      >
        {/* ✅ Pickup Marker */}
        {pickup && typeof pickup.latitude === 'number' && typeof pickup.longitude === 'number' && (
          <Marker
            coordinate={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
            }}
            title="Pickup Location"
            description={pickup.address || 'Selected pickup location'}
            draggable={editable}
            pinColor="#10B981"
            onPress={onPickupPress}
            onDragEnd={(e) => onPickupDragEnd?.(e.nativeEvent.coordinate)}
            accessibilityLabel="Pickup location marker"
          >
            <View style={styles.pickupMarker}>
              <View style={styles.markerDot} />
            </View>
          </Marker>
        )}

        {/* ✅ Drop-off Marker */}
        {dropoff && typeof dropoff.latitude === 'number' && typeof dropoff.longitude === 'number' && (
          <Marker
            coordinate={{
              latitude: dropoff.latitude,
              longitude: dropoff.longitude,
            }}
            title="Drop-off Location"
            description={dropoff.address || 'Selected drop-off location'}
            draggable={editable}
            pinColor="#EF4444"
            onPress={onDropoffPress}
            onDragEnd={(e) => onDropoffDragEnd?.(e.nativeEvent.coordinate)}
            accessibilityLabel="Drop-off location marker"
          >
            <View style={styles.dropoffMarker}>
              <View style={styles.markerSquare} />
            </View>
          </Marker>
        )}

        {/* ✅ Driver Marker */}
        {driverLocation && typeof driverLocation.latitude === 'number' && typeof driverLocation.longitude === 'number' && (
          <Marker
            coordinate={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.driverMarker}>
              <Text style={styles.driverIcon}>🚗</Text>
            </View>
          </Marker>
        )}

        {/* ✅ Route line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4F46E5"
            strokeWidth={4}
            lineDashPattern={Platform.OS === 'ios' ? [6] : undefined}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pickupMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
  },
  dropoffMarker: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#FFF',
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  driverIcon: {
    fontSize: 20,
  },
});
