import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '../../styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LocationSelector({
    locations = [],
    loading = false,
    error = null,
    visible = false,
    onLocationSelect,
    onCurrentLocationPress,
    onClose
}) {
    if (!visible) return null;

    const renderLocation = ({ item }) => (
        <TouchableOpacity
            style={styles.locationItem}
            onPress={() => {
                onLocationSelect(item);
                onClose();
            }}
        >
            <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{item.name}</Text>
                <Text style={styles.locationAddress}>
                    {`${item.address.street}, ${item.address.city}, ${item.address.state} ${item.address.zipCode}`}
                </Text>
            </View>
            {item.isDefault && (
                <Icon name="star" size={16} color={theme.colors.primary.main} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={onCurrentLocationPress}
            >
                <Icon name="map-marker" size={16} color={theme.colors.primary.main} />
                <Text style={styles.currentLocationText}>Use Current Location</Text>
            </TouchableOpacity>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={theme.colors.primary.main} />
                    <Text style={styles.loadingText}>Loading locations...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : locations.length > 0 ? (
                <FlatList
                    data={locations}
                    renderItem={renderLocation}
                    keyExtractor={item => item.id}
                    style={styles.locationsList}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No saved locations</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background.paper,
        borderRadius: theme.borderRadius.md,
        marginTop: theme.spacing.xs,
        ...theme.shadows.md,
        maxHeight: 300,
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    currentLocationText: {
        marginLeft: theme.spacing.sm,
        color: theme.colors.primary.main,
        fontSize: theme.typography.fontSize.md,
    },
    locationsList: {
        flexGrow: 1,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    locationInfo: {
        flex: 1,
    },
    locationName: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    locationAddress: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
    },
    loadingContainer: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: theme.spacing.sm,
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
    },
    errorContainer: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    errorText: {
        color: theme.colors.text.contrast,
        fontSize: theme.typography.fontSize.sm,
        textAlign: 'center',
    },
    emptyContainer: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
    },
}); 