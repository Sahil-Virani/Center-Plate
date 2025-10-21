import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import LocationList from '../../components/locations/LocationList';
import LocationForm from '../../components/locations/LocationForm';
import { useAuth } from '../../contexts/AuthContext';
import { useSession } from '../../contexts/SessionContext';
import userService from '../../services/userService';
import * as Location from 'expo-location';
import LocationService from '../../services/locationService';

const LocationsPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { currentSession, updateSession } = useSession();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formAddress, setFormAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: ''
    });
    const [isDefault, setIsDefault] = useState(false);
    const [editingLocationId, setEditingLocationId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user?.uid) {
            loadLocations();
        }
    }, [user?.uid]);

    const loadLocations = async () => {
        try {
            setLoading(true);
            setErrors({});
            const userData = await userService.getUser(user.uid);
            setLocations(userData.locations || []);
        } catch (error) {
            console.error('Error loading locations:', error);
            setErrors({
                general: 'Unable to load your locations. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddLocation = () => {
        setShowForm(true);
        setIsDefault(false);
    };

    const validateAddress = () => {
        const newErrors = {};
        
        if (!formAddress.street.trim()) {
            newErrors.street = 'Street address is required';
        }
        
        if (!formAddress.city.trim()) {
            newErrors.city = 'City is required';
        }
        
        if (!formAddress.state) {
            newErrors.state = 'State is required';
        }
        
        if (!formAddress.zipCode.trim()) {
            newErrors.zipCode = 'ZIP code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(formAddress.zipCode)) {
            newErrors.zipCode = 'Please enter a valid ZIP code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleManualAddressSubmit = async () => {
        try {
            if (!validateAddress()) return;

            setLoading(true);
            setErrors({});
            const locationData = await LocationService.getCoordinatesFromAddress(formAddress);
            
            if (!locationData || !locationData.coordinates) {
                setErrors({
                    general: 'Could not find this address. Please check and try again.'
                });
                return;
            }

            const locationPayload = {
                address: formAddress,
                coordinates: locationData.coordinates,
                isDefault: isDefault
            };

            if (editingLocationId) {
                await userService.updateLocation(user.uid, editingLocationId, locationPayload);
            } else {
                await userService.addLocation(user.uid, locationPayload);
            }

            await loadLocations();
            setShowForm(false);
            setFormAddress({ street: '', city: '', state: '', zipCode: '' });
            setIsDefault(false);
            setEditingLocationId(null);
        } catch (error) {
            console.error('Error saving location:', error);
            setErrors({
                general: error.message || 'Unable to save location. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCurrentLocationSubmit = async () => {
        try {
            setLoading(true);
            setErrors({});
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrors({
                    general: 'Location permission is required to use your current location.'
                });
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            
            const addressData = await LocationService.getAddressFromCoordinates(
                location.coords.latitude,
                location.coords.longitude
            );

            if (!addressData) {
                setErrors({
                    general: 'Could not find your current location. Please try again.'
                });
                return;
            }

            const locationPayload = {
                address: addressData,
                coordinates: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                },
                isDefault: isDefault
            };

            if (editingLocationId) {
                await userService.updateLocation(user.uid, editingLocationId, locationPayload);
            } else {
                await userService.addLocation(user.uid, locationPayload);
            }

            await loadLocations();
            setShowForm(false);
            setIsDefault(false);
            setEditingLocationId(null);
        } catch (error) {
            console.error('Error getting current location:', error);
            setErrors({
                general: error.message || 'Unable to get your current location. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLocation = async (id) => {
        const location = locations.find(loc => loc._id === id);
        if (!location) {
            setErrors({
                general: 'Location not found. Please try again.'
            });
            return;
        }

        setFormAddress(location.address);
        setIsDefault(location.isDefault);
        setEditingLocationId(id);
        setShowForm(true);
    };

    const handleDeleteLocation = async (id) => {
        try {
            setErrors({});
            const location = locations.find(loc => loc._id === id);
            if (location.isDefault) {
                setErrors({
                    general: 'Cannot delete your default location. Set another location as default first.'
                });
                return;
            }

            await userService.removeLocation(user.uid, id);
            await loadLocations();
        } catch (error) {
            console.error('Error deleting location:', error);
            setErrors({
                general: 'Unable to delete location. Please try again.'
            });
        }
    };

    const handleSetDefaultLocation = async (id) => {
        try {
            setErrors({});
            await userService.setDefaultLocation(user.uid, id);
            await loadLocations();
        } catch (error) {
            console.error('Error setting default location:', error);
            setErrors({
                general: 'Unable to set default location. Please try again.'
            });
        }
    };

    const handleLocationSelect = async (location) => {
        try {
            setErrors({});
            if (currentSession) {
                await updateSession({
                    location: {
                        address: location.address,
                        coordinates: location.coordinates
                    }
                });
            }
            router.back();
        } catch (error) {
            console.error('Error selecting location:', error);
            setErrors({
                general: 'Unable to select location. Please try again.'
            });
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="My Locations"
                variant="primary"
                leftIcon="arrow-left"
                onLeftPress={() => router.back()}
            />

            <ScrollView style={styles.content}>
                {showForm ? (
                    <LocationForm
                        address={formAddress}
                        onAddressChange={setFormAddress}
                        onManualAddressSubmit={handleManualAddressSubmit}
                        onCurrentLocationSubmit={handleCurrentLocationSubmit}
                        isDefault={isDefault}
                        onDefaultChange={setIsDefault}
                        isEditing={!!editingLocationId}
                        errors={errors}
                    />
                ) : (
                    <LocationList
                        locations={locations}
                        defaultLocationId={locations.find(loc => loc.isDefault)?._id}
                        onAddLocation={handleAddLocation}
                        onUpdateLocation={handleUpdateLocation}
                        onDeleteLocation={handleDeleteLocation}
                        onSetDefaultLocation={handleSetDefaultLocation}
                        onLocationSelect={handleLocationSelect}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.default,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    errorContainer: {
        backgroundColor: theme.colors.status.error,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    errorText: {
        color: theme.colors.text.contrast,
        fontSize: theme.typography.fontSize.sm,
        textAlign: 'center',
    }
});

export default LocationsPage; 