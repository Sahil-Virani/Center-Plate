import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';        
import { theme } from '../../styles/theme.js';
import Header from '../../components/common/Header.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import TextInput from '../../components/common/TextInput';
import UserSearch from '../../components/common/UserSearch';
import PreferencesForm from '../../components/preferences/PreferencesForm';
import SessionService from '../../services/sessionService';


export default function CreateSession() {
    const router = useRouter();
    const [sessionLoading, setSessionLoading] = useState(false);
    const [preferences, setPreferences] = useState({
		dietaryValue: '',
		priceValue: '',
		cuisineValue: '',
		includeParking: false,
		includeTransport: false,
	});

    const [sessionData, setSessionData] = useState({
        name: '',
        participants: []
    });
    const [validationErrors, setValidationErrors] = useState({});

    const [showPreferences, setShowPreferences] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!sessionData.name.trim()) {
            errors.name = 'Session name is required';
        }
        if (sessionData.participants.length === 0) {
            errors.participants = 'At least one participant is required';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateSession = async () => {
        setSessionLoading(true);
        if (!validateForm()) {
            setSessionLoading(false);
            return;
        }
        try {
            const participants = sessionData.participants.map(participant => ({
                user: participant._id
            }));

            const session = await SessionService.createSession({
                ...sessionData,
                preferences: preferences,
                participants: participants
            });

            if(!session) {
                throw new Error('Failed to create session');
            }

            Alert.alert('Success', 'Session created successfully');
            router.replace('/home');
        } catch (error) {
            console.error("Error creating session:", error.message)
            validationErrors.general = error.message;
        } finally {
            setSessionLoading(false);
        }
    };

    const handleParticipantSelect = (selectedUser) => {
        setSessionData(prev => ({
            ...prev,
            participants: [...prev.participants, selectedUser]
        }));
    };

    const handleParticipantRemove = (userId) => {
        setSessionData(prev => ({
            ...prev,
            participants: prev.participants.filter(p => p._id !== userId)
        }));
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Header
                title="Create Session"
                variant="primary"
                onLeftPress={() => router.back()}
                style={styles.header}
            />

            <ScrollView style={styles.content}>
                <Card style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Session Details</Text>

                    <TextInput
                        label="Session Name"
                        placeholder="Enter session name"
                        value={sessionData.name}
                        onChangeText={(text) => setSessionData({ ...sessionData, name: text })}
                        icon="users"
                        error={validationErrors.name}
                    />

                    <View style={styles.participantsContainer}>
                        <Text style={styles.fieldLabel}>Participants</Text>
                        <UserSearch
                            onSelect={handleParticipantSelect}
                            selectedUsers={sessionData.participants}
                            onRemove={handleParticipantRemove}
                            error={validationErrors.participants}
                        />
                    </View>

                    <View style={styles.preferencesContainer}>
                        <Text style={styles.fieldLabel}>Session Preferences (Optional)</Text>
                        <Button
                            title={sessionData.preferences ? "Edit Preferences" : "Set Preferences"}
                            onPress={() => setShowPreferences(!showPreferences)}
                            variant="outlined"
                            icon="cog"
                            fullWidth
                        />
                        {showPreferences && (
                            <PreferencesForm
                                preferences={preferences}
                                onPreferencesChange={setPreferences}
                                validationErrors={validationErrors}
                                title="Session Preferences"
                            />
                        )}
                    </View>

                    {validationErrors.general && (
                        <Text style={styles.errorText}>{validationErrors.general}</Text>
                    )}
                </Card>

                <Button
                    title="Create Session"
                    onPress={handleCreateSession}
                    variant="primary"
                    loading={sessionLoading}
                    style={styles.createButton}
                />
            </ScrollView>
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
    formCard: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    fieldLabel: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    participantsContainer: {
        marginBottom: theme.spacing.md,
    },              
    preferencesContainer: {
        marginBottom: theme.spacing.md,
    },
    errorText: {
        color: theme.colors.status.error,
        fontSize: theme.typography.fontSize.md,
        textAlign: 'center',
        marginTop: theme.spacing.sm,
    },
    createButton: {
        marginBottom: theme.spacing.lg,
    },
});