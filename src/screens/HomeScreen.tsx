import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import AccessibilityToggle from '../components/AccessibilityToggle';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { getFontSize, getColor, highContrast } = useAccessibility();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {user?.profileImage && (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          )}
          <View style={styles.userText}>
            <Text style={[styles.greeting, { fontSize: getFontSize(14), color: getColor('#6B7280', '#000') }]}>
              Hello,
            </Text>
            <Text style={[styles.userName, { fontSize: getFontSize(20), color: getColor('#1F2937', '#000') }]}>
              {user?.name || 'Guest'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Profile')}
        >
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={40} color={getColor('#4F46E5', '#000')} />
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.mainCard, highContrast && styles.mainCardHighContrast]}>
        <View style={styles.iconCircle}>
          <Ionicons name="location" size={40} color="#4F46E5" />
        </View>
        <Text style={[styles.mainTitle, { fontSize: getFontSize(24), color: getColor('#1F2937', '#000') }]}>
          Where to?
        </Text>
        <Text style={[styles.mainSubtitle, { fontSize: getFontSize(15), color: getColor('#6B7280', '#000') }]}>
          Book an accessible ride tailored to your needs
        </Text>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('Booking')}
          activeOpacity={0.85}
        >
          <Text style={[styles.bookButtonText, { fontSize: getFontSize(16) }]}>
            Book a Ride
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <Text style={[styles.featuresTitle, { fontSize: getFontSize(18), color: getColor('#1F2937', '#000') }]}>
          Why Choose Mobility?
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuresScroll}>
          {[
            { icon: 'accessibility', color: '#4F46E5', title: 'Fully Accessible', desc: 'All vehicles with ramps & adaptive seating' },
            { icon: 'time', color: '#10B981', title: 'Fast Service', desc: 'Average wait time under 5 minutes' },
            { icon: 'shield-checkmark', color: '#10B981', title: 'Certified Drivers', desc: 'Trained in accessibility assistance' },
          ].map((feature, index) => (
            <View key={index} style={[styles.featureTile, highContrast && styles.featureHighContrast]}>
              <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                <Ionicons name={feature.icon as any} size={24} color={feature.color} />
              </View>
              <Text style={[styles.featureTitle, { fontSize: getFontSize(16), color: getColor('#1F2937', '#000') }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { fontSize: getFontSize(14), color: getColor('#6B7280', '#000') }]} numberOfLines={2} ellipsizeMode='tail'>
                {feature.desc}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <AccessibilityToggle />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  greeting: {
    fontWeight: '500',
  },
  userName: {
    fontWeight: '700',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainCardHighContrast: {
    borderWidth: 3,
    borderColor: '#000',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainTitle: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  mainSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  bookButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: '700',
    marginRight: 8,
  },
  features: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
  },
  featuresTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  featuresScroll: {
    paddingVertical: 8,
  },
  featureTile: {
    width: 220,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  featureHighContrast: {
    borderWidth: 2,
    borderColor: '#000',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    lineHeight: 20,
    textAlign: 'center',
  },
});
