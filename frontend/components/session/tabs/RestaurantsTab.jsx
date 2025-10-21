import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { theme } from '../../../styles/theme.js';
import Card from '../../common/Card.jsx';
import Button from '../../common/Button.jsx';
const NO_IMAGE = "https://static.tildacdn.com/tild6538-3239-4337-b435-393935363438/broken-image-example.png";
const RestaurantsTab = ({ restaurants, handleStartVoting}) => {


    const renderRestaurantCard = (restaurant) => {
        return (
            <Card key={restaurant.rid} style={styles.restaurantCard}>
                <View style={styles.restaurantHeader}>
                    <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                        <Text style={styles.restaurantAddress}>
                            {restaurant.address? restaurant.address : 'No address available'}
                        </Text>     
                    </View>
                </View>

                {restaurant.images && restaurant.images.length > 0 && (
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.imageContainer}
                    >
                        {restaurant.images.map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: image }}
                                style={styles.restaurantImage}
                            />
                        ))}
                    </ScrollView>
                )}
                {restaurant.images && restaurant.images.length === 0 && (
                    <Image
                        source={{ uri: NO_IMAGE }}
                        style={styles.restaurantImage}
                    />
                )}

                <View style={styles.categoriesContainer}>
                    {restaurant.categories?.map((category, index) => (
                        <View key={index} style={styles.categoryTag}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                    ))}
                </View>
            </Card>
        );
    };

    return (
        <ScrollView style={styles.container} >

            <Card style={styles.infoCard}>
                <Text style={styles.infoText}>
                    {restaurants.length > 0 
                        ? `Found ${restaurants.length} restaurants near the meeting point.`
                        : 'No restaurants found near the meeting point.'}
                </Text>
            </Card>
            {restaurants.length > 0 && (
                <Button
                    title="Start Voting"
                    variant="primary"
                    onPress={handleStartVoting}
                />
            )}

            <View style={styles.restaurantsList}>
                {restaurants.map(renderRestaurantCard)}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoCard: {
        marginBottom: theme.spacing.lg,
    },
    infoText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
        textAlign: 'center',
    },
    restaurantsList: {
        gap: theme.spacing.lg,
    },
    restaurantCard: {
        padding: theme.spacing.md,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    restaurantInfo: {
        flex: 1,
        marginRight: theme.spacing.md,
    },
    restaurantName: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    restaurantAddress: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.secondary,
    },
    voteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.background.default,
    },
    votedButton: {
        backgroundColor: theme.colors.primary + '15',
    },
    voteCount: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.secondary,
    },
    votedCount: {
        color: theme.colors.primary.main,
    },
    imageContainer: {
        marginBottom: theme.spacing.md,
    },
    restaurantImage: {
        width: 200,
        height: 150,
        borderRadius: theme.borderRadius.md,
        marginRight: theme.spacing.sm,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    categoryTag: {
        backgroundColor: theme.colors.background.default,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    categoryText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
    },
});

export default RestaurantsTab; 