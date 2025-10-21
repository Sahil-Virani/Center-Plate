import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext.js';  
import { useSocket } from '../../../hooks/useSocket.js';
import { theme } from '../../../styles/theme.js';
import Header from '../../../components/common/Header.jsx';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';
import sessionService from '../../../services/sessionService.js'

export default function Vote() {
    const { id } = useLocalSearchParams();  
    const router = useRouter(); 
    const { user } = useAuth();
    const { subscribe, joinRoom, leaveRoom, isConnected, isInitialized } = useSocket();
    
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [votingInProgress, setVotingInProgress] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);

    const [totalVotes, setTotalVotes] = useState(0);
    const [sortedRestaurants, setSortedRestaurants] = useState([]);  

    // Check if all participants have voted
    const allParticipantsVoted = session?.participants?.every(p => 
        p.invitation === 'accepted' && 
        session.restaurants?.some(r => r.votes?.includes(p.user._id))
    );

    // Get the winning restaurant
    const winningRestaurant = sortedRestaurants[0];

    useEffect(() => {
        // Calculate total votes by summing votes across all restaurants
        if (session?.restaurants) {
            const total = session.restaurants.reduce((sum, restaurant) => 
                sum + (restaurant.votes?.length || 0), 0);
            setTotalVotes(total);
            
            // Sort restaurants by vote count
            const sorted = [...session.restaurants]
                .sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0));
            setSortedRestaurants(sorted);
        }
    }, [session]);

    useEffect(() => {
        if (!id || !isInitialized || !isConnected) {
            console.log('Waiting for socket connection...', { id, isInitialized, isConnected });
            return;
        }

        console.log('Setting up socket events for voting session:', id);
        
        joinRoom(id);
        
        const unsubscribeSession = subscribe('sessionUpdated', (updatedSession) => {
            if (updatedSession._id === id) {
                console.log('Session updated:', updatedSession);
                setSession(updatedSession);
            }
        });

        return () => {
            console.log('Cleaning up socket subscriptions');
            leaveRoom(id);
            unsubscribeSession();
        };
    }, [id, isInitialized, isConnected, subscribe, joinRoom, leaveRoom]);


    useEffect(() => {
        const fetchSession = async () => {
            try {
                setLoading(true);
                const session = await sessionService.getSession(id);
                if (!session) {
                    setError('Session not found');
                return;
            }
                setSession(session);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id]);

    const handleVote = async (rid) => {
        if (votingInProgress) {
            console.log('Vote already in progress, please wait');
            return;
        }

        try {
            setVotingInProgress(true);
            console.log('Voting for restaurant:', rid);
            
            const hasVotedForThisRestaurant = session.restaurants
                .find(r => r.rid === rid)
                ?.votes.includes(user.uid);
            
            if (hasVotedForThisRestaurant) {
                console.log('User has already voted for this restaurant');
                Alert.alert('Already Voted', 'You have already voted for this restaurant.');
                return;
            }
            
            const updatedSession = await sessionService.voteOnRestaurant(id, rid, user.uid);
            if (!updatedSession) {
                throw new Error('Failed to submit vote');
            }
            
            console.log('Vote submitted successfully');
            setSession(updatedSession);
        } catch (error) {
            console.error('Error submitting vote:', error);
            
            // Handle specific error cases
            if (error.message === 'User has already voted on this restaurant') {
                Alert.alert('Already Voted', 'You have already voted for this restaurant.');
            } else {
                Alert.alert('Error', error.message || 'Failed to submit vote. Please try again.');
            }
        } finally {
            setVotingInProgress(false);
        }
    };

    const handleShowResults = async () => {
        try {
            setVotingInProgress(true);
            // Update session status to finished
            const updatedSession = await sessionService.updateSessionStatus(id, 'finished');
            if (!updatedSession) {
                throw new Error('Failed to update session status');
            }
            setSession(updatedSession);
            // Navigate to results page
            router.push(`/session/results/${id}`);
        } catch (error) {
            console.error('Error showing results:', error);
            Alert.alert('Error', error.message || 'Failed to show results. Please try again.');
        } finally {
            setVotingInProgress(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Header
                    title="Loading..."
                    variant="secondary"
                    style={styles.header}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary.main} />
                </View>
            </View>
        )
    }

    if (error) {
    return (
            <View style={styles.container}>
                <Header
                    title="Error"
                    variant="secondary"
                    style={styles.header}
                />
                <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={48} color={theme.colors.error.main} />
                    <Text style={styles.errorText}>
                            {error}
                    </Text>
                    <Button
                        title="Try Again"
                        onPress={() => router.replace(`/session/vote/${id}`)}
                        variant="primary"
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Vote for a Restaurant"
                variant="primary"
                style={styles.header}
            />
            <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.statsCard}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsTitle}>Voting Stats</Text>
                        <Text style={styles.voteCount}>
                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} cast
                        </Text>
                    </View>
                    <View style={styles.leadingSection}>
                        <Text style={styles.leadingTitle}>Leading Restaurants</Text>
                        {sortedRestaurants.slice(0, 3).map((restaurant, index) => {
                            const voteCount = restaurant.votes?.length || 0;
                            const votePercentage = totalVotes > 0 
                                ? Math.round((voteCount / totalVotes) * 100) 
                                : 0;
                            
                            return (
                                <View key={restaurant.rid} style={styles.leadingItem}>
                                    <View style={styles.leadingRank}>
                                        <Text style={styles.rankText}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.leadingInfo}>
                                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                                        <Text style={styles.votePercentage}>
                                            {voteCount} {voteCount === 1 ? 'vote' : 'votes'} ({votePercentage}%)
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </Card>

                {allParticipantsVoted && (
                    <Card style={styles.resultsCard}>
                        <View style={styles.resultsContent}>
                            <Text style={styles.resultsTitle}>All Votes Are In!</Text>
                            <Text style={styles.resultsText}>
                                Everyone has voted. Ready to see which restaurant won?
                            </Text>
                            <Button
                                title="Show Results"
                                onPress={() => setShowResultsModal(true)}
                                variant="primary"
                                style={styles.showResultsButton}
                            />
                        </View>
                    </Card>
                )}

                <Card style={styles.restaurantsCard}>
                    <Text style={styles.sectionTitle}>All Restaurants</Text>
                    <View style={styles.restaurantsList}>
                        {sortedRestaurants.map((restaurant) => {
                            const hasVoted = restaurant.votes?.includes(user.uid);
                            const voteCount = restaurant.votes?.length || 0;
                            const votePercentage = totalVotes > 0 
                                ? Math.round((voteCount / totalVotes) * 100) 
                                : 0;
                            
                            return (
                                <TouchableOpacity 
                                    key={restaurant.rid} 
                                    onPress={() => handleVote(restaurant.rid)}
                                    disabled={votingInProgress || hasVoted}
                                >
                                    <Card 
                                        style={[
                                            styles.restaurantCard,
                                            hasVoted && styles.selectedCard
                                        ]}
                                    >
                                        <View style={styles.restaurantImageContainer}>
                                            {restaurant.images ? (
                                                <Image 
                                                    source={{ uri: restaurant.images[0] }} 
                                                    style={styles.restaurantImage}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={styles.noImageContainer}>
                                                    <Icon name="cutlery" size={24} color={theme.colors.text.secondary} />
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.restaurantInfo}>
                                            <Text style={styles.restaurantName}>{restaurant.name}</Text>
                                            <Text style={styles.restaurantDetails}>
                                                {restaurant.address}
                                            </Text>
                                            <View style={styles.restaurantMeta}>
                                                <View style={styles.metaItem}>
                                                    <Icon name="users" size={14} color={theme.colors.primary.main} />
                                                    <Text style={styles.metaText}>{voteCount} votes ({votePercentage}%)</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.voteIndicator}>
                                            <Icon 
                                                name={hasVoted ? "check-circle" : "circle-o"} 
                                                size={24} 
                                                color={hasVoted ? theme.colors.primary.main : theme.colors.text.secondary} 
                                            />
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Card>

                
            </ScrollView>

            {/* Results Confirmation Modal */}
            {showResultsModal && (
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Show Results?</Text>
                        <Text style={styles.modalText}>
                            This will mark the session as finished and show the winning restaurant.
                        </Text>
                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                onPress={() => setShowResultsModal(false)}
                                variant="secondary"
                            />
                            <Button
                                title="Show Results"
                                onPress={handleShowResults}
                                variant="primary"
                            />
                        </View>
                    </Card>
                </View>
            )}
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
    scrollContent: {
        paddingBottom: theme.spacing.xl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsCard: {
        marginBottom: theme.spacing.lg,
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    statsTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
    },
    voteCount: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
    },
    leadingSection: {
        gap: theme.spacing.sm,
    },
    leadingTitle: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    leadingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    leadingRank: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankText: {
        color: theme.colors.primary.main,
        fontWeight: theme.typography.fontWeight.bold,
    },
    leadingInfo: {
        flex: 1,
    },
    restaurantName: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    votePercentage: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
    },
    restaurantsCard: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    restaurantsList: {
        gap: theme.spacing.sm,
    },
    restaurantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    selectedCard: {
        backgroundColor: theme.colors.primary.light,
    },
    restaurantImageContainer: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        marginRight: theme.spacing.md,
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
    },
    noImageContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.background.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restaurantInfo: {
        flex: 1,
        marginRight: theme.spacing.md,
    },
    restaurantDetails: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
        marginBottom: theme.spacing.xs,
    },
    restaurantMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    metaText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
    },
    voteIndicator: {
        marginLeft: theme.spacing.sm,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
        gap: theme.spacing.lg,
    },
    errorText: {
        color: theme.colors.text.contrast,
        fontSize: theme.typography.fontSize.md,
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.light,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    modalText: {
        color: theme.colors.text.light,
        fontSize: theme.typography.fontSize.md,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    resultsCard: {
        marginTop: theme.spacing.lg,
    },
    resultsContent: {
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    resultsTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    resultsText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.md,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    showResultsButton: {
        minWidth: 200,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    modalCard: {
        width: '100%',
        maxWidth: 400,
        padding: theme.spacing.lg,
    },
});