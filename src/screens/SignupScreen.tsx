import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'driver' | 'customer'>('customer');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { signup } = useAuth();
  const { getFontSize, getColor, highContrast } = useAccessibility();

  const handleSignup = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name, phone, role);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add" size={40} color="#4F46E5" />
            </View>
            <Text style={[styles.title, { fontSize: getFontSize(24), color: getColor('#1F2937', '#000') }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { fontSize: getFontSize(16), color: getColor('#6B7280', '#000') }]}>
              Join Mobility today
            </Text>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputContainer, highContrast && styles.inputContainerHighContrast]}>
              <Ionicons name="person" size={20} color={getColor('#6B7280', '#000')} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16), color: getColor('#1F2937', '#000') }]}
                placeholder="Full Name"
                placeholderTextColor={getColor('#9CA3AF', '#666')}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={[styles.inputContainer, highContrast && styles.inputContainerHighContrast]}>
              <Ionicons name="mail" size={20} color={getColor('#6B7280', '#000')} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16), color: getColor('#1F2937', '#000') }]}
                placeholder="Email"
                placeholderTextColor={getColor('#9CA3AF', '#666')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputContainer, highContrast && styles.inputContainerHighContrast]}>
              <Ionicons name="call" size={20} color={getColor('#6B7280', '#000')} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16), color: getColor('#1F2937', '#000') }]}
                placeholder="Phone Number"
                placeholderTextColor={getColor('#9CA3AF', '#666')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.inputContainer, highContrast && styles.inputContainerHighContrast]}>
              <Ionicons name="lock-closed" size={20} color={getColor('#6B7280', '#000')} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16), color: getColor('#1F2937', '#000') }]}
                placeholder="Password"
                placeholderTextColor={getColor('#9CA3AF', '#666')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color={getColor('#6B7280', '#000')} />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, highContrast && styles.inputContainerHighContrast]}>
              <Ionicons name="lock-closed" size={20} color={getColor('#6B7280', '#000')} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { fontSize: getFontSize(16), color: getColor('#1F2937', '#000') }]}
                placeholder="Confirm Password"
                placeholderTextColor={getColor('#9CA3AF', '#666')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
                <Ionicons name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color={getColor('#6B7280', '#000')} />
              </TouchableOpacity>
            </View>

            {/* Role Selection */}
            <View style={[styles.roleContainer, highContrast && styles.roleContainerHighContrast]}>
              <Text style={[styles.roleLabel, { fontSize: getFontSize(16), color: getColor('#374151', '#000') }]}>I am a:</Text>
              <View style={styles.roleOptions}>
                <TouchableOpacity
                  style={[styles.roleOption, role === 'customer' && styles.roleOptionSelected]}
                  onPress={() => setRole('customer')}
                >
                  <Ionicons name={role === 'customer' ? 'radio-button-on' : 'radio-button-off'} size={20} color={role === 'customer' ? '#4F46E5' : getColor('#6B7280', '#000')} />
                  <Text style={[styles.roleText, { fontSize: getFontSize(16), color: getColor('#1F2937', '#000') }]}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleOption, role === 'driver' && styles.roleOptionSelected]}
                  onPress={() => setRole('driver')}
                >
                  <Ionicons name={role === 'driver' ? 'radio-button-on' : 'radio-button-off'} size={20} color={role === 'driver' ? '#4F46E5' : getColor('#6B7280', '#000')} />
                  <Text style={[styles.roleText, { fontSize: getFontSize(16), color: getColor('#1F2937', '#000') }]}>Driver</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={[styles.signupButtonText, { fontSize: getFontSize(16) }]}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { fontSize: getFontSize(14), color: getColor('#6B7280', '#000') }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { fontSize: getFontSize(14) }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerHighContrast: {
    borderWidth: 2,
    borderColor: '#000',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
  },
  signupButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginRight: 4,
  },
  loginLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  eyeIcon: {
    marginLeft: 12,
  },
  roleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleContainerHighContrast: {
    borderWidth: 2,
    borderColor: '#000',
  },
  roleLabel: {
    fontWeight: '600',
    marginBottom: 12,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  roleOptionSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  roleText: {
    marginLeft: 8,
    fontWeight: '500',
  },
});