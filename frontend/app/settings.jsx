import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Text} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../styles/theme.js';
import Header from '../components/common/Header.jsx';
import Card from '../components/common/Card.jsx';
import { List, ListItem } from '../components/common/List.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Settings() {
	const router = useRouter();
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [locationServices, setLocationServices] = useState(true);
  
	return (
		<View style={styles.container}>
            <Header
                title="Settings"
                variant="primary"
                style={styles.header}
            />

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<Card style={styles.section}>
					<Text style={styles.sectionTitle}>Account</Text>
					<List>
						<ListItem
							onPress={() => router.push('/profile')}
						>	
							<View style={styles.listItemContent}>
								<Icon name="user" size={20} color={theme.colors.text.secondary} />
								<Text style={styles.listItemText}>Profile</Text>
								<Icon name="chevron-right" size={16} color={theme.colors.text.secondary} />
							</View>
						</ListItem>
						<ListItem
							onPress={() => router.push('/auth/recover')}
						>	
							<View style={styles.listItemContent}>
								<Icon name="lock" size={20} color={theme.colors.text.secondary} />
								<Text style={styles.listItemText}>Change Password</Text>
								<Icon name="chevron-right" size={16} color={theme.colors.text.secondary} />
							</View>
						</ListItem>
						<ListItem
							onPress={() => router.push('/preferences')}
						>	
							<View style={styles.listItemContent}>
								<Icon name="gear" size={20} color={theme.colors.text.secondary} />
								<Text style={styles.listItemText}>Preferences</Text>
								<Icon name="chevron-right" size={16} color={theme.colors.text.secondary} />
							</View>
						</ListItem>

						<ListItem
							onPress={() => router.push('/locations/manageLocations')}
						>	
							<View style={styles.listItemContent}>
								<Icon name="map" size={20} color={theme.colors.text.secondary} />
								<Text style={styles.listItemText}>Locations</Text>
								<Icon name="chevron-right" size={16} color={theme.colors.text.secondary} />
							</View>
						</ListItem>
					</List>
				</Card>

				<Card style={styles.section}>
					<Text style={styles.sectionTitle}>Notifications</Text>
					<List>
						<ListItem>
							<View style={styles.listItemContent}>
								<Icon name="bell" size={20} color={theme.colors.text.secondary} />
								<Text style={styles.listItemText}>Push Notifications</Text>
								<Switch
									value={notifications}
									onValueChange={setNotifications}
									trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.light }}
									thumbColor={notifications ? theme.colors.primary.main : theme.colors.text.secondary}
								/>
							</View>
						</ListItem>
					</List>
				</Card>

				<Card style={styles.section}>
					<Text style={styles.sectionTitle}>Appearance</Text>
					<List>
						<ListItem>
							<View style={styles.listItemContent}>
								<Icon name="moon-o" size={20} color={theme.colors.text.secondary} />
								<Text style={styles.listItemText}>Dark Mode</Text>
								<Switch
									value={darkMode}
									onValueChange={setDarkMode}
									trackColor={{ false: theme.colors.border.light, true: theme.colors.primary.light }}
									thumbColor={darkMode ? theme.colors.primary.main : theme.colors.text.secondary}
								/>
							</View>
						</ListItem>
					</List>
				</Card>
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
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: theme.spacing.lg,
	},
	section: {
		marginBottom: theme.spacing.lg,
	},
	sectionTitle: {
		fontSize: theme.typography.fontSize.lg,
		fontWeight: theme.typography.fontWeight.bold,
		color: theme.colors.text.primary,
		marginBottom: theme.spacing.md,
		paddingHorizontal: theme.spacing.md,
	},
	listItemContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		gap: theme.spacing.md,
	},
	listItemText: {
		flex: 1,
		color: theme.colors.text.primary,
		fontSize: theme.typography.fontSize.md,
	},
});
