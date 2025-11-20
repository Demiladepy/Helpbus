import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '../types';
import { FirebaseService } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<BookingStackParamList, 'Payment'>;

export default function PaymentScreen({ navigation, route }: Props) {
  const { fare = 0, pickup, dropoff, rideId, driverId } = route.params || {};
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'Test User');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/30');
  const [cvv, setCvv] = useState('123');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!rideId) {
      Alert.alert('Missing info', 'Ride ID not provided.');
      return;
    }

    setLoading(true);

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        // In a real app we'd call a payment SDK here. For the hackathon demo we mock success.
        const paymentSuccess = true;
        if (!paymentSuccess) throw new Error('Payment failed');

        Alert.alert('Paid Successfully');

        // Get the ride details
        const ride = await FirebaseService.getRide(rideId);

        setLoading(false);

        if (ride) {
          // Navigate directly to Trip view to show the assignment
          navigation.navigate('Trip', { ride });
        } else {
          Alert.alert('Error', 'Failed to load ride details.');
          navigation.navigate('BookingMain');
        }
      } catch (err: any) {
        setLoading(false);
        Alert.alert('Error', err?.message || 'Payment failed');
      }
    }, 1400);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>₦{Number(fare || 0).toFixed(2)}</Text>

        <Text style={styles.label}>Name on Card</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        <Text style={styles.label}>Card Number</Text>
        <TextInput value={cardNumber} onChangeText={setCardNumber} style={styles.input} keyboardType="numeric" />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Expiry</Text>
            <TextInput value={expiry} onChangeText={setExpiry} style={styles.input} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CVV</Text>
            <TextInput value={cvv} onChangeText={setCvv} style={styles.input} keyboardType="numeric" />
          </View>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePay} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payButtonText}>Pay Now</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.helper}>This is a mock payment for demo purposes only.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#111827' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  label: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  amount: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, marginTop: 6, backgroundColor: '#FFF' },
  row: { flexDirection: 'row', marginTop: 4 },
  payButton: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  payButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  helper: { marginTop: 12, color: '#6B7280', fontSize: 12, textAlign: 'center' },
});
