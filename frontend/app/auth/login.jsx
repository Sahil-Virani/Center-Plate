import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext.js';
import { theme } from '../../styles/theme.js';
import Header from '../../components/common/Header.jsx';
import TextInput from '../../components/common/TextInput.jsx';
import Button from '../../components/common/Button.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Login() {
    const router = useRouter();
    const { handleLogin } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (field) => (value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '', general: '' }));
    };

    const validateForm = () => {
        const newErrors = {
            email: '',
            password: '',
            general: ''
        };
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onLogin = async () => {
        try {
            if (!validateForm()) return;
            
            setLoading(true);
            setErrors(prev => ({ ...prev, general: '' }));
            await handleLogin(formData.email, formData.password);
            router.replace('/home');
        } catch (error) {
            setErrors(prev => ({ ...prev, general: error.message }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Header
                title="Welcome Back"
                variant="primary"
                style={styles.header}
            />

                <View style={styles.content}>
                    <TextInput
                        label="Email"
                        value={formData.email}
                        onChangeText={handleChange('email')}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon={<Icon name="envelope" size={20} color={theme.colors.text.secondary} />}
                        error={errors.email}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            label="Password"
                            value={formData.password}
                            onChangeText={handleChange('password')}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            leftIcon={<Icon name="lock" size={20} color={theme.colors.text.secondary} />}
                            error={errors.password}
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon} 
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Icon 
                                name={showPassword ? "eye-slash" : "eye"} 
                                size={20} 
                                color={theme.colors.text.secondary} 
                            />
                        </TouchableOpacity>
                    </View>

                    {errors.general ? (
                        <Text style={styles.errorText}>{errors.general}</Text>
                    ) : null}

                    <View style={styles.forgotPassword}>
                        <Button
                            title="Forgot Password?"
                            variant="text"
                            onPress={() => router.push('/auth/recover')}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Login"
                            onPress={onLogin}
                            loading={loading}
                            disabled={loading}
                            fullWidth
                        />

                    <Button
                        title="Create Account"
                        variant="outline"
                        onPress={() => router.push('/auth/signup')}
                        fullWidth
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
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
    passwordContainer: {
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: theme.spacing.md,
        top: '50%',
        transform: [{ translateY: -10 }],
        padding: theme.spacing.xs,
    },
    errorText: {
        color: theme.colors.status.error,
        fontSize: theme.typography.fontSize.sm,
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
    forgotPassword: {
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
        gap: theme.spacing.sm,
    },
});
  
