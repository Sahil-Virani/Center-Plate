import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext.js';
import { theme } from '../styles/theme.js';
import Header from '../components/common/Header.jsx';
import Button from '../components/common/Button.jsx';
import Loading from '../components/common/Loading.jsx';
import PreferencesForm from '../components/preferences/PreferencesForm.jsx';
import UserService from '../services/userService.js';

export default function Preferences() {
	const router = useRouter();
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [preferences, setPreferences] = useState({
		dietaryValue: '',
		priceValue: '',
		cuisineValue: '',
		includeParking: false,
		includeTransport: false,
	});
	const [validationErrors, setValidationErrors] = useState({});

	useEffect(() => {
		if (user) {
			loadPreferences();
		}
	}, [user]);

	const loadPreferences = async () => {
		try {
			setLoading(true);
			const userData = await UserService.getUser(user.uid);
			if (userData.preferences) {
				setPreferences(userData.preferences);
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to load preferences');
		} finally {
			setLoading(false);
		}
	};

	const validateForm = () => {
		const errors = {};
		if (!preferences.cuisineValue) {
			errors.cuisineValue = 'Cuisine preference is required';
		}
		if (!preferences.priceValue) {
			errors.priceValue = 'Price range is required';
		}
		if (!preferences.dietaryValue) {
			errors.dietaryValue = 'Dietary preference is required';
		}
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSavePreferences = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			setLoading(true);
			await UserService.updatePreferences(user.uid, preferences);
			Alert.alert('Success', 'Preferences saved successfully');
		} catch (error) {
			Alert.alert('Error', error.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <Loading fullScreen />;
	}

	return (
		<View style={styles.container}>
			<Header
				title="Preferences"
				variant="primary"
				leftIcon="arrow-left"
				onLeftPress={() => router.back()}
				style={styles.header}
			/>

			<ScrollView style={styles.content}>
				<PreferencesForm
					preferences={preferences}
					onPreferencesChange={setPreferences}
					validationErrors={validationErrors}
					title="Your Preferences"
				/>

				<Button
					title="Save Preferences"
					onPress={handleSavePreferences}
					variant="primary"
					loading={loading}
					style={styles.saveButton}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.default,
	},
	header: {
		borderBottomLeftRadius: theme.borderRadius.lg,
		borderBottomRightRadius: theme.borderRadius.lg,
		...theme.shadows.md,
	},
	content: {
		flex: 1,
		padding: theme.spacing.lg,
	},
	saveButton: {
		marginBottom: theme.spacing.lg,
	},
});