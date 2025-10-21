import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext.js';
import { theme } from '../../styles/theme.js';
import Header from '../../components/common/Header.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Loading from '../../components/common/Loading.jsx';
import TextInput from '../../components/common/TextInput.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RecoverPassword() {
    const router = useRouter();
    const { handleSendPasswordReset, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleResetPassword = async () => {
        try {
            setError('');
            
            if (!email.trim()) {
                setError('Please enter your email address');
                return;
            }

            if (!validateEmail(email)) {
                setError('Please enter a valid email address');
                return;
            }

            await handleSendPasswordReset(email);
            Alert.alert(
                'Success',
                'Password reset instructions have been sent to your email',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/auth/login'),
                    },
                ]
            );
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    return (
        <View style={styles.container}>
            <Header
                title="Recover Password"
                variant="primary"
                leftIcon="arrow-left"
                onLeftPress={() => router.back()}
                style={styles.header}
            />

                <View style={styles.content}>
                    <Card style={styles.formCard}>
                        <Text style={styles.sectionTitle}>Reset Your Password</Text>
                        <Text style={styles.description}>
                            Enter your email address and we'll send you instructions to reset your password.
                        </Text>

                        <TextInput
                            label="Email Address"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError('');
                            }}
                            leftIcon={<Icon name="envelope" size={20} color={theme.colors.text.secondary} />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={error}
                        />
                    </Card>

                    <Button
                        title="Send Reset Instructions"
                        onPress={handleResetPassword}
                        variant="primary"
                        loading={loading}
                        icon="paper-plane"
                        style={styles.resetButton}
                    />

                <Card style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Need Help?</Text>
                    <View style={styles.infoSteps}>
                        <View style={styles.step}>
                            <Icon name="envelope" size={24} color={theme.colors.primary.main} />
                            <Text style={styles.stepText}>Enter your registered email address</Text>
                        </View>
                        <View style={styles.step}>
                            <Icon name="check-circle" size={24} color={theme.colors.primary.main} />
                            <Text style={styles.stepText}>Check your email for reset instructions</Text>
                        </View>
                        <View style={styles.step}>
                            <Icon name="key" size={24} color={theme.colors.primary.main} />
                            <Text style={styles.stepText}>Follow the link to reset your password</Text>
                        </View>
                    </View>
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.default,
    },
    header: {
        borderBottomLeftRadius: theme.borderRadius.lg,
        borderBottomRightRadius: theme.borderRadius.lg,
        ...theme.shadows.md,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    formCard: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    description: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
        marginBottom: theme.spacing.md,
    },
    resetButton: {
        marginBottom: theme.spacing.lg,
    },
    infoCard: {
        marginBottom: theme.spacing.lg,
    },
    infoTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    infoSteps: {
        gap: theme.spacing.md,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    stepText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
        flex: 1,
    }
});