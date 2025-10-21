import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../styles/theme';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/FontAwesome';

const LocationCard = ({ 
    location, 
    onUpdate, 
    onDelete, 
    onSetDefault, 
    onSelect,
    showDefaultButton = true,
    showEditButton = true,
    showDeleteButton = true,
    isDefault
}) => {
    return (
        <Card
            onPress={() => onSelect?.(location)}
            style={styles.card}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.name}>
                        {location.address.street}
                    </Text>
                    {isDefault && (
                        <View style={styles.defaultBadge}>
                            <Icon name="star" size={12} color={theme.colors.primary.main} />
                            <Text style={styles.defaultText}>Default</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.addressContainer}>
                <Text style={styles.addressText}>
                    {`${location.address.city}, ${location.address.state} ${location.address.zipCode}`}
                </Text>
                <Text style={styles.coordinatesText}>
                    {`${location.coordinates.latitude.toFixed(6)}, ${location.coordinates.longitude.toFixed(6)}`}
                </Text>
            </View>

            <View style={styles.actions}>
                {showDefaultButton && !isDefault && (
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.defaultButton]}
                        onPress={() => onSetDefault(location._id)}
                    >
                        <Icon name="star" size={20} color={theme.colors.primary.main} />
                    </TouchableOpacity>
                )}
                {showEditButton && (
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => onUpdate(location._id)}
                    >
                        <Icon name="pencil" size={20} color={theme.colors.primary.main} />
                    </TouchableOpacity>
                )}
                {showDeleteButton && !isDefault && (
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => onDelete(location._id)}
                    >
                        <Icon name="trash" size={20} color={theme.colors.text.contrast} />
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background.paper,
        marginBottom: theme.spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    name: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
    },
    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        backgroundColor: theme.colors.primary.light,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    defaultText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.primary.main,
        fontWeight: theme.typography.fontWeight.medium,
    },
    addressContainer: {
        marginBottom: theme.spacing.md,
    },
    addressText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    coordinatesText: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.secondary,
        fontFamily: 'monospace',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: theme.spacing.sm,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.circle,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background.paper,
        ...theme.shadows.sm,
    },
    defaultButton: {
        backgroundColor: theme.colors.primary.light,
    },
    editButton: {
        backgroundColor: theme.colors.primary.light,
    },
    deleteButton: {
        backgroundColor: theme.colors.status.error,
    },
});

export default LocationCard; 