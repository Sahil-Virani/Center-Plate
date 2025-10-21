import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../../styles/theme';
import LocationCard from './LocationCard';
import Button from '../common/Button';
import Card from '../common/Card';

const LocationList = ({ 
    locations = [],
    defaultLocationId,
    onAddLocation,
    onUpdateLocation,
    onDeleteLocation,
    onSetDefaultLocation,
    onLocationSelect,
    showAddButton = true
}) => {
    return (
        <View style={styles.container}>
            {showAddButton && (
                <Card style={styles.headerCard}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Saved Locations</Text>
                        <Button
                            title="Add Location"
                            onPress={onAddLocation}
                            variant="primary"
                            size="small"
                            icon="plus"
                        />
                    </View>
                </Card>
            )}

            {locations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No locations saved yet</Text>
                    {showAddButton && (
                        <Button
                            title="Add Your First Location"
                            onPress={onAddLocation}
                            variant="outlined"
                        />
                    )}
                </View>
            ) : (
                <View style={styles.list}>
                    {locations.map((location) => (
                        <LocationCard
                            key={location._id}
                            location={location}
                            isDefault={location._id === defaultLocationId}
                            onUpdate={onUpdateLocation}
                            onDelete={onDeleteLocation}
                            onSetDefault={onSetDefaultLocation}
                            onSelect={onLocationSelect}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.default,
    },
    headerCard: {
        marginBottom: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
    },
    list: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        gap: theme.spacing.md,
    },
    emptyText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
        textAlign: 'center',
    }
});

export default LocationList; 