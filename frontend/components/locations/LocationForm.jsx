import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { theme } from '../../styles/theme';
import Button from '../common/Button';
import Card from '../common/Card';
import TextInput from '../common/TextInput';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';

// US States for dropdown
const STATE_OPTIONS = [
    { label: 'Select State', value: '' },
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' },
    { label: 'Delaware', value: 'DE' },
    { label: 'Florida', value: 'FL' },
    { label: 'Georgia', value: 'GA' },
    { label: 'Hawaii', value: 'HI' },
    { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' },
    { label: 'Indiana', value: 'IN' },
    { label: 'Iowa', value: 'IA' },
    { label: 'Kansas', value: 'KS' },
    { label: 'Kentucky', value: 'KY' },
    { label: 'Louisiana', value: 'LA' },
    { label: 'Maine', value: 'ME' },
    { label: 'Maryland', value: 'MD' },
    { label: 'Massachusetts', value: 'MA' },
    { label: 'Michigan', value: 'MI' },
    { label: 'Minnesota', value: 'MN' },
    { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' },
    { label: 'Montana', value: 'MT' },
    { label: 'Nebraska', value: 'NE' },
    { label: 'Nevada', value: 'NV' },
    { label: 'New Hampshire', value: 'NH' },
    { label: 'New Jersey', value: 'NJ' },
    { label: 'New Mexico', value: 'NM' },
    { label: 'New York', value: 'NY' },
    { label: 'North Carolina', value: 'NC' },
    { label: 'North Dakota', value: 'ND' },
    { label: 'Ohio', value: 'OH' },
    { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' },
    { label: 'Pennsylvania', value: 'PA' },
    { label: 'Rhode Island', value: 'RI' },
    { label: 'South Carolina', value: 'SC' },
    { label: 'South Dakota', value: 'SD' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Texas', value: 'TX' },
    { label: 'Utah', value: 'UT' },
    { label: 'Vermont', value: 'VT' },
    { label: 'Virginia', value: 'VA' },
    { label: 'Washington', value: 'WA' },
    { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' },
    { label: 'Wyoming', value: 'WY' },
];

const LocationForm = ({ 
    address,
    onAddressChange,
    onManualAddressSubmit,
    onCurrentLocationSubmit,
    isDefault = false,
    onDefaultChange,
    isEditing = false,
    errors = {}
}) => {
    const [currentLocationLoading, setCurrentLocationLoading] = useState(false);
    const [manualAddressLoading, setManualAddressLoading] = useState(false);

    const handleCurrentLocationSubmit = async () => {
        try {
            setCurrentLocationLoading(true);
            await onCurrentLocationSubmit();
        } finally {
            setCurrentLocationLoading(false);
        }
    };

    const handleManualAddressSubmit = async () => {
        try {
            setManualAddressLoading(true);
            await onManualAddressSubmit();
        } finally {
            setManualAddressLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.formCard}>
                <Text style={styles.sectionTitle}>
                    {isEditing ? 'Edit Location' : 'Add New Location'}
                </Text>

                <Button
                    title="Use Current Location"
                    onPress={handleCurrentLocationSubmit}
                    variant="outlined"
                    disabled={currentLocationLoading}
                    icon="location-arrow"
                    fullWidth
                    style={styles.currentLocationButton}
                    loading={currentLocationLoading}
                    loadingColor={theme.colors.primary.dark}
                    loadingBackgroundColor={theme.colors.primary.light}
                    loadingSize="large"
                />

                <View style={styles.divider} />

                <View style={styles.section}>
                    <TextInput
                        label="Street Address"
                        placeholder="Enter street address"
                        value={address.street}
                        onChangeText={(text) => onAddressChange({ ...address, street: text })}
                        leftIcon={<Icon name="map-marker" size={20} color={theme.colors.text.secondary} />}
                        error={errors.street}
                    />

                    <TextInput
                        label="City"
                        placeholder="Enter city"
                        value={address.city}
                        onChangeText={(text) => onAddressChange({ ...address, city: text })}
                        leftIcon={<Icon name="building" size={20} color={theme.colors.text.secondary} />}
                        error={errors.city}
                    />

                    <View style={styles.stateZipContainer}>
                        <View style={styles.stateInput}>
                            <Text style={styles.dropdownLabel}>State</Text>
                            <Dropdown
                                style={[
                                    styles.dropdown,
                                    errors.state && styles.dropdownError
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={STATE_OPTIONS}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                value={address.state}
                                onChange={item => {
                                    onAddressChange({ ...address, state: item.value });
                                }}
                                renderLeftIcon={() => (
                                    <Icon name="map" size={20} color={theme.colors.text.secondary} style={styles.dropdownIcon} />
                                )}
                                itemTextStyle={styles.itemTextStyle}
                                itemContainerStyle={styles.itemContainerStyle}
                            />
                            {errors.state && (
                                <Text style={styles.errorText}>{errors.state}</Text>
                            )}
                        </View>

                        <View style={styles.zipInput}>
                            <TextInput
                                label="ZIP Code"
                                placeholder="Enter ZIP code"
                                value={address.zipCode}
                                onChangeText={(text) => onAddressChange({ ...address, zipCode: text })}
                                keyboardType="numeric"
                                leftIcon={<Icon name="hashtag" size={20} color={theme.colors.text.secondary} />}
                                error={errors.zipCode}
                            />
                        </View>
                    </View>

                    <View style={styles.defaultSwitchContainer}>
                        <Text style={styles.defaultSwitchLabel}>Set as Default Location</Text>
                        <Switch
                            value={isDefault}
                            onValueChange={onDefaultChange}
                            trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.light }}
                            thumbColor={isDefault ? theme.colors.primary.main : theme.colors.text.secondary}
                        />
                    </View>
                </View>

                {errors.general && (
                    <Text style={styles.generalErrorText}>{errors.general}</Text>
                )}

                <Button
                    title={isEditing ? "Update Location" : "Add Location"}
                    onPress={handleManualAddressSubmit}
                    variant="primary"
                    disabled={manualAddressLoading}
                    fullWidth
                    style={styles.submitButton}
                    loading={manualAddressLoading}
                    loadingColor={theme.colors.primary.main}
                    loadingBackgroundColor={theme.colors.primary.light}
                    loadingSize="large"
                />
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background.default,
    },
    formCard: {
        padding: theme.spacing.lg,
    },
    section: {
        gap: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    currentLocationButton: {
        marginBottom: theme.spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.divider,
        marginVertical: theme.spacing.md,
    },
    stateZipContainer: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    stateInput: {
        flex: 1,
    },
    zipInput: {
        flex: 1,
    },
    dropdown: {
        height: 50,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.background.paper,
        ...theme.shadows.sm,
    },
    placeholderStyle: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.secondary,
    },
    selectedTextStyle: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
    },
    dropdownIcon: {
        marginRight: theme.spacing.sm,
    },
    itemTextStyle: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
    },
    itemContainerStyle: {
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },
    defaultSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
    },
    defaultSwitchLabel: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
    },
    submitButton: {
        marginTop: theme.spacing.md,
    },
    dropdownLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
        fontWeight: theme.typography.fontWeight.medium,
    },
    dropdownError: {
        borderColor: theme.colors.status.error,
    },
    errorText: {
        color: theme.colors.status.error,
        fontSize: theme.typography.fontSize.sm,
        marginTop: theme.spacing.xs,
    },
    generalErrorText: {
        color: theme.colors.status.error,
        fontSize: theme.typography.fontSize.sm,
        marginTop: theme.spacing.md,
        textAlign: 'center',
    },
});

export default LocationForm; 