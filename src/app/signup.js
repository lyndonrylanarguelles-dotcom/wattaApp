import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


export default function Signup() {
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert(
        'Missing Information',
        'Please complete all fields.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'The passwords do not match.'
      );
      return;
    }

    setLoading(true);

    const result = await signUp(
      name,
      email,
      password
    );

    setLoading(false);

    if (!result.success) {
      Alert.alert('Sign Up Failed', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111827"
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Create your WattaApp account
          </Text>

          <View style={styles.inputContainer}>
           <Ionicons
    name="person-outline"
    size={21}
    color={theme.text}
/>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={
                  showPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={21}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB'
  },

  keyboard: {
    flex: 1
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827'
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 7,
    marginBottom: 28
  },

  inputContainer: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#111827'
  },

  signupButton: {
    height: 55,
    borderRadius: 15,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },

  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    gap: 5
  },

  loginText: {
    color: '#6B7280'
  },

  loginLink: {
    color: '#6366F1',
    fontWeight: '700'
  }
});