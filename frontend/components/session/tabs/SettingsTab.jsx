import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../../../styles/theme.js';
import Card from '../../common/Card.jsx';
import Button from '../../common/Button.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';

const SettingsTab = ({handleDeleteSession, onEditSession, onManagePreferences}) => {

    const [showEditSession, setShowEditSession] = useState(false);
    const [showManagePreferences, setShowManagePreferences] = useState(false);

    const handleEditSession = () => {
        onEditSession();
        setShowEditSession(false);
    };

    const handleManagePreferences = () => {
        onManagePreferences();
        setShowManagePreferences(false);
    };

    return (


        <Card style={styles.settingsCard}>
            <View style={styles.cardHeader}>
                <Icon name="cog" size={20} color={theme.colors.primary.main} />
                <Text style={styles.sectionTitle}>Session Settings</Text>
            </View>
            <View style={styles.settingsContainer}>
                <Button
                    title="Edit Session Info"
                    onPress={() => setShowEditSession(true)}
                    variant="outlined"
                    icon="edit"
                    fullWidth
                />
                <Button
                    title="Manage Preferences"
                    onPress={() => setShowManagePreferences(true)}
                    variant="outlined"
                    icon="sliders"
                    fullWidth
                />
                <Button
                    title="Delete Session"
                    onPress={handleDeleteSession}
                    variant="danger"
                    icon="trash"
                    fullWidth
                />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    settingsCard: {
        marginBottom: theme.spacing.lg,
    },
    settingsContainer: {
        gap: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
    },
});

export default SettingsTab;