import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';

type AccessibilityScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Accessibility'>;

interface Props {
  navigation: AccessibilityScreenNavigationProp;
}

export default function AccessibilityScreen({ navigation }: Props) {
  const { largeFonts, highContrast, toggleLargeFonts, toggleHighContrast, getFontSize, getColor } = useAccessibility();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.card, highContrast && styles.cardHighContrast]}>
        <Text style={[styles.sectionTitle, { fontSize: getFontSize(18), color: getColor('#1F2937', '#000') }]}>
          Text & Display
        </Text>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { fontSize: getFontSize(16), color: getColor('#374151', '#000') }]}>
              Large Text
            </Text>
            <Text style={[styles.settingDescription, { fontSize: getFontSize(14), color: getColor('#6B7280', '#000') }]}>
              Increase text size throughout the app
            </Text>
          </View>
          <Switch
            value={largeFonts}
            onValueChange={toggleLargeFonts}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor={largeFonts ? '#FFFFFF' : '#F9FAFB'}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { fontSize: getFontSize(16), color: getColor('#374151', '#000') }]}>
              High Contrast
            </Text>
            <Text style={[styles.settingDescription, { fontSize: getFontSize(14), color: getColor('#6B7280', '#000') }]}>
              Enhance contrast for better visibility
            </Text>
          </View>
          <Switch
            value={highContrast}
            onValueChange={toggleHighContrast}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor={highContrast ? '#FFFFFF' : '#F9FAFB'}
          />
        </View>
      </View>

      <View style={[styles.card, highContrast && styles.cardHighContrast]}>
        <Text style={[styles.sectionTitle, { fontSize: getFontSize(18), color: getColor('#1F2937', '#000') }]}>
          Support
        </Text>
        <Text style={[styles.helpText, { fontSize: getFontSize(14), color: getColor('#6B7280', '#000') }]}>
          If you need additional accessibility features or have questions about using the app, please contact our support team.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHighContrast: {
    borderWidth: 2,
    borderColor: '#000',
  },
  title: {
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    lineHeight: 20,
  },
  helpText: {
    lineHeight: 20,
  },
});