import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ONBOARDING_KEY = 'watta_onboarding_complete';

export default function Onboarding() {
  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/login');
    } catch (error) {
      console.log('Onboarding error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.iconCircle}>
          <Ionicons
            name="checkmark-done-outline"
            size={70}
            color="#6366F1"
          />
        </View>

        <Text style={styles.title}>Welcome to WattaApp</Text>

        <Text style={styles.subtitle}>
          Stay organized, manage your tasks, and keep your day on track.
        </Text>

        <View style={styles.features}>

          <View style={styles.feature}>
            <Ionicons
              name="calendar-outline"
              size={25}
              color="#6366F1"
            />

            <View>
              <Text style={styles.featureTitle}>
                Plan Your Day
              </Text>

              <Text style={styles.featureText}>
                Organize tasks using the calendar.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Ionicons
              name="notifications-outline"
              size={25}
              color="#6366F1"
            />

            <View>
              <Text style={styles.featureTitle}>
                Get Reminders
              </Text>

              <Text style={styles.featureText}>
                Never forget your important tasks.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Ionicons
              name="layers-outline"
              size={25}
              color="#6366F1"
            />

            <View>
              <Text style={styles.featureTitle}>
                Organize Everything
              </Text>

              <Text style={styles.featureText}>
                Categorize your tasks easily.
              </Text>
            </View>
          </View>

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={finishOnboarding}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB'
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center'
  },

  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 12
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 35
  },

  features: {
    gap: 18,
    marginBottom: 35
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827'
  },

  featureText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3
  },

  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  }
});