import React from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Profile() {
    const handleLogout = () => {
    router.replace('/login');
};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.replace('/')}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={21}
                            color="#F1F5F9"
                        />
                    </TouchableOpacity>

                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>
                            Profile
                        </Text>

                        <Text style={styles.headerSubtitle}>
                            Your WattaApp profile
                        </Text>
                    </View>
                </View>

                {/* PROFILE CARD */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Ionicons
                            name="person"
                            size={38}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text style={styles.name}>
                        Watta User
                    </Text>

                    <Text style={styles.email}>
                        demo@wattaapp.com
                    </Text>
                </View>

                {/* ACCOUNT INFORMATION */}
                <View style={styles.infoCard}>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#818CF8"
                            />
                        </View>

                        <View>
                            <Text style={styles.infoLabel}>
                                NAME
                            </Text>

                            <Text style={styles.infoValue}>
                                Watta User
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#818CF8"
                            />
                        </View>

                        <View>
                            <Text style={styles.infoLabel}>
                                EMAIL
                            </Text>

                            <Text style={styles.infoValue}>
                                demo@wattaapp.com
                            </Text>
                        </View>
                    </View>

                </View>

                {/* LOGOUT */}
                <TouchableOpacity
    style={styles.logoutButton}
    onPress={handleLogout}
    activeOpacity={0.85}
>
    <Ionicons
        name="log-out-outline"
        size={21}
        color="#EF4444"
    />

    <Text style={styles.logoutText}>
        Log Out
    </Text>
</TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1120',
    },

    content: {
        flex: 1,
        padding: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },

    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#182235',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerText: {
        marginLeft: 13,
    },

    headerTitle: {
        color: '#F1F5F9',
        fontSize: 27,
        fontWeight: '800',
    },

    headerSubtitle: {
        color: '#B8C3D1',
        fontSize: 13,
        marginTop: 3,
    },

    profileCard: {
        backgroundColor: '#182235',
        borderRadius: 24,
        padding: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#344257',
    },

    avatar: {
        width: 82,
        height: 82,
        borderRadius: 28,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },

    name: {
        color: '#F1F5F9',
        fontSize: 22,
        fontWeight: '800',
    },

    email: {
        color: '#B8C3D1',
        fontSize: 13,
        marginTop: 6,
    },

    infoCard: {
        backgroundColor: '#182235',
        borderRadius: 20,
        padding: 18,
        marginTop: 18,
        borderWidth: 1,
        borderColor: '#344257',
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    infoIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: '#312E81',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 13,
    },

    infoLabel: {
        color: '#8190A4',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
    },

    infoValue: {
        color: '#F1F5F9',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 3,
    },

    divider: {
        height: 1,
        backgroundColor: '#344257',
        marginVertical: 16,
    },

    logoutButton: {
        height: 55,
        borderRadius: 17,
        backgroundColor: '#2A1B22',
        borderWidth: 1,
        borderColor: '#5B2A33',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
    },

    logoutText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: '800',
    },
});