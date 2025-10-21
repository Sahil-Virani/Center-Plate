import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../../../styles/theme.js';
import Card from '../../common/Card.jsx';
import Button from '../../common/Button.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';

const OverviewTab = ({ 
    currentSession, 
    currentParticipant,
    handleLeaveSession, 
    handleUpdateSessionStatus,
    handleDeleteSession
}) => {
    const renderContent = () => {
        
        return (
            <>
                <Card style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <Icon name="info-circle" size={20} color={theme.colors.primary.main} />
                        <Text style={styles.sectionTitle}>Session Information</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoItem}>
                            <Icon name="users" size={20} color={theme.colors.text.secondary} />
                            <Text style={styles.infoText}>
                                {currentSession.participants?.length || 0} participants
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon name="clock-o" size={20} color={theme.colors.text.secondary} />
                            <Text style={styles.infoText}>
                                Created {new Date(currentSession.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </Card>

                {currentParticipant && (
                    <Card style={styles.leaveCard}>
                        <View style={styles.leaveHeader}>
                            <Icon name="sign-out" size={20} color={theme.colors.status.error} />
                            <Text style={styles.leaveTitle}>Leave Session</Text>
                        </View>
                        <Text style={styles.leaveMessage}>
                            You can leave this session at any time. This action cannot be undone.
                        </Text>
                        <Button
                            title="Leave Session"
                            onPress={handleLeaveSession}
                            variant="danger"
                            fullWidth
                        />
                    </Card>
                )}
            </>
        );
    };

    return renderContent();
};

const styles = StyleSheet.create({
    infoCard: {
        marginBottom: theme.spacing.lg,
    },
    infoContainer: {
        gap: theme.spacing.md,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    infoText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
    },
    inviteCard: {
        marginBottom: theme.spacing.lg,
    },
    inviteTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    inviteMessage: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    inviteActions: {
        gap: theme.spacing.md,
    },
    leaveCard: {
        marginTop: theme.spacing.lg,
        borderColor: theme.colors.status.error,
    },
    leaveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    leaveTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.status.error,
    },
    leaveMessage: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
        marginBottom: theme.spacing.md,
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
    activeTitle: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
        marginBottom: theme.spacing.md,
    },
});

export default OverviewTab; 