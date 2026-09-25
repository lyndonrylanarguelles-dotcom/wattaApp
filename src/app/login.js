import React, { useState } from 'react';

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
        Alert.alert(
            'Missing Information',
            'Please enter your email and password.'
        );
        return;
    }
const handleLogout = () => {
    Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: () => {
                    router.replace('/login');
                },
            },
        ]
    );
};
    if (
        email.trim().toLowerCase() ===
            'demo@wattaapp.com' &&
        password === '123456'
    ) {
        router.replace('/');
    } else {
        Alert.alert(
            'Login Failed',
            'Invalid email or password.'
        );
    }
};

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <View style={styles.content}>
                    <View style={styles.iconCircle}>
                        <Ionicons
                            name="checkmark-done"
                            size={30}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text style={styles.title}>
                        Welcome Back
                    </Text>

                    <Text style={styles.subtitle}>
                        Sign in to continue to WattaApp
                    </Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>
                            EMAIL
                        </Text>

                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#8190A4"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#8190A4"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <Text style={styles.label}>
                            PASSWORD
                        </Text>

                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#8190A4"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#8190A4"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                <Ionicons
                                    name={
                                        showPassword
                                            ? 'eye-off-outline'
                                            : 'eye-outline'
                                    }
                                    size={20}
                                    color="#8190A4"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.loginButtonText}>
                                Login
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={20}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1120',
    },

    keyboard: {
        flex: 1,
    },

    content: {
        flex: 1,
        paddingHorizontal: 26,
        justifyContent: 'center',
    },

    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },

    title: {
        color: '#F8FAFC',
        fontSize: 29,
        fontWeight: '800',
        textAlign: 'center',
    },

    subtitle: {
        color: '#B8C3D1',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 9,
    },

    form: {
        marginTop: 30,
    },

    label: {
        color: '#8190A4',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginTop: 12,
        marginBottom: 8,
    },

    inputWrapper: {
        height: 54,
        backgroundColor: '#202D43',
        borderWidth: 1,
        borderColor: '#344257',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
        color: '#F1F5F9',
        fontSize: 15,
        marginLeft: 11,
    },

    loginButton: {
        height: 56,
        borderRadius: 17,
        backgroundColor: '#6366F1',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 24,
    },

    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },

    demoBox: {
        backgroundColor: '#182235',
        borderRadius: 16,
        padding: 15,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#344257',
    },

    demoTitle: {
        color: '#F1F5F9',
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 6,
    },

    demoText: {
        color: '#B8C3D1',
        fontSize: 12,
        marginTop: 2,
    },
});