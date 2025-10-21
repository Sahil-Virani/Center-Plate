import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../../../styles/theme.js';
import Card from '../../common/Card.jsx';
import Button from '../../common/Button.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import Modal from '../../common/Modal';

const LocationsTab = ({ 
    currentParticipant, 
    loadingLocation,  
    handleLocationSelect,
}) => {
    const [showLocationModal, setShowLocationModal] = useState(false);

    const handleSelect = (location, isCurrentLocation) => {
        setShowLocationModal(false);
        handleLocationSelect(location, isCurrentLocation)
    }

    return (
        <Card style={styles.locationsCard}>
            <View style={styles.cardHeader}>
                <Icon name="map-marker" size={20} color={theme.colors.primary.main} />
                <Text style={styles.sectionTitle}>Location Management</Text>
            </View>

            <View style={styles.locationsContainer}>
                {currentParticipant?.location && currentParticipant?.location.latitude && currentParticipant?.location.longitude && (
                    <View style={styles.currentLocation}>
                        <Text style={styles.locationText}>Current Location</Text>
                        <Text style={styles.locationText}>
                            {currentParticipant?.location.latitude.toFixed(6)}, {currentParticipant?.location.longitude.toFixed(6)}
                        </Text>
                    </View>
                )}

                <Button
                    title="Select New Location"
                    onPress={() => setShowLocationModal(true)}
                    variant="primary"
                    fullWidth
                />

                <Modal
                    visible={showLocationModal}
                    onClose={() => setShowLocationModal(false)}
                    title="Select Location"
                    message="Choose a location for the meeting point"
                >
                    <ScrollView style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Location</Text>
                            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                                <Icon name="close" size={20} color={theme.colors.text.secondary} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={styles.locationItem}
                            onPress={() => handleSelect(null, true)}
                            loading={loadingLocation}
                        >
                            <Icon name="location-arrow" size={20} color={theme.colors.primary.main} />
                            <Text style={styles.locationItemText}>Use Current Location</Text>
                        </TouchableOpacity>
                        {currentParticipant?.user?.locations && currentParticipant.user.locations.map((location) => (
                            <TouchableOpacity 
                                key={location._id}
                                style={styles.locationItem}
                                onPress={() => handleSelect(location, false)}
                                loading={loadingLocation}
                            >
                                <Icon name="map-marker" size={20} color={theme.colors.text.secondary} />
                                <Text style={styles.locationItemText}>{location.address.street}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Modal>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    locationsCard: {
        marginBottom: theme.spacing.lg,
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
    locationsContainer: {
        gap: theme.spacing.md,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background.paper,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    locationButtonText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.md,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
    },
    modalContent: {
        maxHeight: 400,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    locationItemText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.md,
    },
    currentLocation: {
        backgroundColor: theme.colors.background.paper,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    locationText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.medium,
    },
    coordinatesText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
        marginLeft: theme.spacing.xl,
    },
});

export default LocationsTab; 