import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../../styles/theme.js';
import Card from '../../common/Card.jsx';
import Button from '../../common/Button.jsx';
import Modal from '../../common/Modal.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';

const ParticipantsTab = ({ 
    currentSession, 
    user,
    handleRemoveParticipant,
    handlePromoteParticipant,
    handleDemoteParticipant,
}) => {

    const [showParticipantActions, setShowParticipantActions] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const currentParticipant = currentSession?.participants?.find(p => p?.user?._id === user.uid);
        setIsAdmin(currentParticipant?.role === 'admin');
    }, [currentSession]);

    return (
        <Card style={styles.participantsCard}>
            <View style={styles.cardHeader}>
                <Icon name="users" size={20} color={theme.colors.primary.main} />
                <Text style={styles.sectionTitle}>Participants</Text>
            </View>
            <View style={styles.participantsList}>
                {currentSession.participants?.map((participant) => (
                    <View key={participant.user._id} style={styles.participantItem}>
                        <View style={styles.participantInfo}>
                            <Icon 
                                name={participant.role === 'admin' ? 'star' : 'user'} 
                                size={20} 
                                color={participant.role === 'admin' ? theme.colors.primary.main : theme.colors.text.secondary} 
                            />
                            <Text style={styles.participantName}>
                                {participant.user.username}
                            </Text>
                        </View>
                        <View style={styles.participantActions}>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: participant.invitation === 'accepted' ? theme.colors.status.success + '20' : theme.colors.status.warning + '20' }
                            ]}>
                                <Text style={[
                                    styles.participantStatusText,
                                    { color: participant.invitation === 'accepted' ? theme.colors.status.success : theme.colors.status.warning }
                                ]}>
                                    {participant.invitation === 'accepted' ? 'Accepted' : 'Pending'}
                                </Text>

                                <Text style={[
                                    styles.participantStatusText,
                                    { color: participant.location && participant.location.latitude && participant.location.longitude ? theme.colors.status.success : theme.colors.status.warning }
                                ]}>
                                    {participant.location && participant.location.latitude && participant.location.longitude ? 'Location Set' : 'No Location Set'}
                                </Text>
                            </View>
                            {isAdmin && participant.user._id !== user.uid && (
                                <TouchableOpacity 
                                    style={styles.actionButton}
                                    onPress={() => {
                                        setSelectedParticipant(participant);
                                        setShowParticipantActions(true);
                                    }}
                                >
                                    <Icon name="ellipsis-v" size={20} color={theme.colors.text.secondary} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            <Modal
                visible={showParticipantActions}
                onClose={() => setShowParticipantActions(false)}
            >
                <Text style={styles.modalTitle}>Manage {selectedParticipant?.user.username}</Text>

                <View style={styles.participantActionsList}>
                    {selectedParticipant?.role === 'participant' && (
                        <Button
                            title="Promote to Admin"
                            onPress={() => handlePromoteParticipant(selectedParticipant?.user._id)}
                            variant="outlined"
                            icon="star"
                            fullWidth
                        />
                    )}
                    {selectedParticipant?.role === 'admin' && (
                        <Button
                            title="Demote to Participant"
                            onPress={() => handleDemoteParticipant(selectedParticipant?.user._id)}
                            variant="outlined"
                            icon="user"
                            fullWidth
                        />
                    )}
                    <Button
                        title="Remove Participant"
                        onPress={() => handleRemoveParticipant(selectedParticipant?.user._id)}
                        variant="danger"
                        icon="user-times"
                        fullWidth
                    />
                </View>
            </Modal>
        </Card>
    );
};

const styles = StyleSheet.create({
    participantsCard: {
        marginBottom: theme.spacing.lg,
    },
    participantsList: {
        gap: theme.spacing.md,
    },
    participantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.xs,
    },
    participantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    participantName: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.md,
    },
    participantActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    participantStatusText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
    },
    actionButton: {
        padding: theme.spacing.xs,
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

    actionButton: {
        padding: theme.spacing.xs,
    },
    participantActionsList: {
        gap: theme.spacing.md,
    },
    modalTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
    },
});

export default ParticipantsTab; 