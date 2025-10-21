import React from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { theme } from '../../styles/theme.js';
import Card from '../common/Card.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';

// Constants for dropdown options
const DIETARY_OPTIONS = [
    { label: 'Select Dietary Preference', value: '' },
    { label: 'Vegetarian', value: 'Vegetarian' },
    { label: 'Vegan', value: 'Vegan' },
    { label: 'Gluten-Free', value: 'Gluten-Free' },
    { label: 'Halal', value: 'Halal' },
    { label: 'Kosher', value: 'Kosher' },
];

const CUISINE_OPTIONS = [
    { label: 'Select Cuisine Preference', value: '' },
    { label: 'Italian', value: 'Italian' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Mexican', value: 'Mexican' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Thai', value: 'Thai' },
    { label: 'Mediterranean', value: 'Mediterranean' },
    { label: 'American', value: 'American' },
    { label: 'French', value: 'French' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'Greek', value: 'Greek' },
    { label: 'Korean', value: 'Korean' },
    { label: 'Vietnamese', value: 'Vietnamese' },
    { label: 'Brazilian', value: 'Brazilian' },
];

const PRICE_OPTIONS = [
    { label: 'Select Price Range', value: '' },
    { label: '$', value: '$' },
    { label: '$$', value: '$$' },
    { label: '$$$', value: '$$$' },
];

export default function PreferencesForm({ 
    preferences, 
    onPreferencesChange, 
    validationErrors = {},
    showTransportOptions = true,
    title = "Dining Preferences"
}) {
    return (
        <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>{title}</Text>

            <View style={styles.dropdownContainer}>
                <View style={styles.dropdownLabel}>
                    <Icon name="leaf" size={20} color={theme.colors.text.secondary} />
                    <Text style={styles.dropdownLabelText}>Dietary Requirements</Text>
                </View>
                <Dropdown
                    style={[
                        styles.dropdown,
                        validationErrors.dietaryValue && styles.dropdownError
                    ]}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    data={DIETARY_OPTIONS}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={preferences.dietaryValue}
                    onChange={item => {
                        onPreferencesChange({ ...preferences, dietaryValue: item.value });
                    }}
                    
                    renderItem={item => (
                        <View style={styles.dropdownItem}>
                            <Text style={styles.dropdownItemText}>{item.label}</Text>
                        </View>
                    )}
                    renderRightIcon={() => (
                        <Icon
                            style={styles.dropdownIcon}
                            color={theme.colors.text.secondary}
                            name="chevron-down"
                            size={20}
                        />
                    )}
                />
                {validationErrors.dietaryValue && (
                    <Text style={styles.errorText}>{validationErrors.dietaryValue}</Text>
                )}
            </View>

            <View style={styles.dropdownContainer}>
                <View style={styles.dropdownLabel}>
                    <Icon name="cutlery" size={20} color={theme.colors.text.secondary} />
                    <Text style={styles.dropdownLabelText}>Preferred Cuisine</Text>
                </View>
                <Dropdown
                    style={[
                        styles.dropdown,
                        validationErrors.cuisineValue && styles.dropdownError
                    ]}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    data={CUISINE_OPTIONS}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={preferences.cuisineValue}
                    onChange={item => {
                        onPreferencesChange({ ...preferences, cuisineValue: item.value });
                    }}
                    
                    renderItem={item => (
                        <View style={styles.dropdownItem}>
                            <Text style={styles.dropdownItemText}>{item.label}</Text>
                        </View>
                    )}
                    renderRightIcon={() => (
                        <Icon
                            style={styles.dropdownIcon}
                            color={theme.colors.text.secondary}
                            name="chevron-down"
                            size={20}
                        />
                    )}
                />
                {validationErrors.cuisineValue && (
                    <Text style={styles.errorText}>{validationErrors.cuisineValue}</Text>
                )}
            </View>

            <View style={styles.dropdownContainer}>
                <View style={styles.dropdownLabel}>
                    <Icon name="dollar" size={20} color={theme.colors.text.secondary} />
                    <Text style={styles.dropdownLabelText}>Price Range</Text>
                </View>
                <Dropdown
                    style={[
                        styles.dropdown,
                        validationErrors.priceValue && styles.dropdownError
                    ]}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    data={PRICE_OPTIONS}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={preferences.priceValue}
                    onChange={item => {
                        onPreferencesChange({ ...preferences, priceValue: item.value });
                    }}
                    
                    renderItem={item => (
                        <View style={styles.dropdownItem}>
                            <Text style={styles.dropdownItemText}>{item.label}</Text>
                        </View>
                    )}
                    renderRightIcon={() => (
                        <Icon
                            style={styles.dropdownIcon}
                            color={theme.colors.text.secondary}
                            name="chevron-down"
                            size={20}
                        />
                    )}
                />
                {validationErrors.priceValue && (
                    <Text style={styles.errorText}>{validationErrors.priceValue}</Text>
                )}
            </View>

            {showTransportOptions && (
                <>
                    <View style={styles.switchContainer}>
                        <View style={styles.switchLabel}>
                            <Icon name="car" size={20} color={theme.colors.text.secondary} />
                            <Text style={styles.switchLabelText}>Include Parking</Text>
                        </View>
                        <Switch
                            value={preferences.includeParking}
                            onValueChange={value => onPreferencesChange({ ...preferences, includeParking: value })}
                            trackColor={{ false: theme.colors.border.light, true: theme.colors.primary }}
                            thumbColor={theme.colors.background.paper}
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <View style={styles.switchLabel}>
                            <Icon name="bus" size={20} color={theme.colors.text.secondary} />
                            <Text style={styles.switchLabelText}>Include Public Transport</Text>
                        </View>
                        <Switch
                            value={preferences.includeTransport}
                            onValueChange={value => onPreferencesChange({ ...preferences, includeTransport: value })}
                            trackColor={{ false: theme.colors.border.light, true: theme.colors.primary }}
                            thumbColor={theme.colors.background.paper}
                        />
                    </View>
                </>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    formCard: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    dropdownContainer: {
        marginBottom: theme.spacing.md,
    },
    dropdownLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    dropdownLabelText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.md,
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
    dropdownError: {
        borderColor: theme.colors.status.error,
    },
    dropdownPlaceholder: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.secondary,
    },
    dropdownSelectedText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
    },
    dropdownIcon: {
        marginRight: theme.spacing.sm,
    },
    dropdownItem: {
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },
    dropdownItemText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
    },
    errorText: {
        color: theme.colors.status.error,
        fontSize: theme.typography.fontSize.sm,
        marginTop: theme.spacing.xs,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
    },
    switchLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    switchLabelText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.md,
    },
}); 