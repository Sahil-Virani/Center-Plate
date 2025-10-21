import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker} from 'react-native-maps';
import { theme } from '../../styles/theme.js';
import Icon from 'react-native-vector-icons/FontAwesome';

const SessionMap = ({ 
    participants = [], 
    midpoint = null,
    restaurants = [],   
    currentLocation,
    loading
}) => {

    const initialRegion = React.useMemo(() => {
        if (midpoint) {
            return {
                latitude: midpoint.latitude,
                longitude: midpoint.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
        }
        if (currentLocation) {
            return {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
        }
        return {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
    }, [currentLocation, midpoint]);
    
    const renderParticipantMarker = (participant) => {
        if (!participant?.location?.latitude || !participant?.location?.longitude) return null;
        if (participant.invitation !== 'accepted') return null;

        return (
            <Marker
                key={`participant-${participant.user._id}`}
                coordinate={{
                    latitude: participant.location.latitude,
                    longitude: participant.location.longitude
                }}
                title={participant.user.username}
                titleVisibility="visible"
            >
                <View style={styles.markerContainer}>
                    <View style={[styles.marker, { backgroundColor: theme.colors.status.info}]}>
                        <Icon name="user" size={16} color={theme.colors.background.paper} />
                    </View>
                </View>
            </Marker>
        );
    };

    const renderMidpointMarker = () => {
        if (!midpoint?.latitude || !midpoint?.longitude) return null;

        return (
            <Marker
                coordinate={{
                    latitude: midpoint.latitude,
                    longitude: midpoint.longitude
                }}
            >
                <View style={styles.markerContainer}>
                    <View style={[styles.marker, { backgroundColor: theme.colors.status.warning }]}>
                        <Icon name="map-marker" size={16} color={theme.colors.background.paper} />
                    </View>
                </View>
            </Marker>
        );
    };

    const renderRestaurantMarker = (restaurant) => {
        if (!restaurant?.coordinates?.length === 2) return null;

        return (
            <Marker
                key={`restaurant-${restaurant.rid}`}
                coordinate={{
                    latitude: restaurant.coordinates[0],
                    longitude: restaurant.coordinates[1]
                }}
                title={restaurant.name}
                titleVisibility="visible"
            >
                <View style={styles.markerContainer}>
                    <View style={[styles.marker, { backgroundColor: theme.colors.status.error }]}>
                        <Icon name="cutlery" size={16} color={theme.colors.background.paper} />
                    </View>
                </View>
            </Marker>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator style={styles.loading} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                userInterfaceStyle="light"
            >
                {/* Render all accepted participants with locations */}
                {participants?.map(renderParticipantMarker)}

                {/* Render the midpoint if it exists */}
                {renderMidpointMarker()}

                {/* Render all suggestions */}
                {restaurants?.map(renderRestaurantMarker)}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    marker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    loading: {
        color: theme.colors.primary.main,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SessionMap; 