import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext.js';
import { useSocket } from '../../../hooks/useSocket.js';
import { theme } from '../../../styles/theme.js';
import Header from '../../../components/common/Header.jsx';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';
import sessionService from '../../../services/sessionService.js';

export default function Results() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const { subscribe, joinRoom, leaveRoom, isConnected, isInitialized } = useSocket();
    
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id || !isInitialized || !isConnected) {
            console.log('Waiting for socket connection...', { id, isInitialized, isConnected });
            return;
        }

        console.log('Setting up socket events for results:', id);
        
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
        if (!user) {
            router.replace('/auth/login');
            return;
        }
    }, [user]);

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
        );
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
                    <Icon name="exclamation-circle" size={48} color={theme.colors.status.error} />
                    <Text style={styles.errorText}>{error}</Text>
                    <Button
                        title="Try Again"
                        onPress={() => router.replace(`/session/results/${id}`)}
                        variant="primary"
                    />
                </View>
            </View>
        );
    }

    // Get the winning restaurant (highest votes)
    const winningRestaurant = session.restaurants
        .sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0))[0];

    const voteCount = winningRestaurant.votes?.length || 0;
    const totalVotes = session.restaurants.reduce((sum, r) => sum + (r.votes?.length || 0), 0);
    const votePercentage = Math.round((voteCount / totalVotes) * 100);

    return (
        <View style={styles.container}>
            <Header
                title="Voting Results"
                variant="primary"
                style={styles.header}
            />
            <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Card style={styles.winnerCard}>
                    <View style={styles.winnerHeader}>
                        <Icon name="trophy" size={48} color={theme.colors.status.warning} />
                        <Text style={styles.winnerTitle}>Winner!</Text>
                    </View>
                    
                    <View style={styles.restaurantImageContainer}>
                        {winningRestaurant.images ? (
                            <Image 
                                source={{ uri: winningRestaurant.images[0] }} 
                                style={styles.restaurantImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.noImageContainer}>
                                <Icon name="cutlery" size={48} color={theme.colors.text.secondary} />
                            </View>
                        )}
                    </View>

                    <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantName}>{winningRestaurant.name}</Text>
                        <Text style={styles.restaurantAddress}>{winningRestaurant.address}</Text>
                        
                        <View style={styles.voteStats}>
                            <View style={styles.statItem}>
                                <Icon name="users" size={20} color={theme.colors.primary.main} />
                                <Text style={styles.statText}>
                                    {voteCount} {voteCount === 1 ? 'vote' : 'votes'} ({votePercentage}%)
                                </Text>
                            </View>
                        </View>
                    </View>
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
    winnerCard: {
        marginBottom: theme.spacing.lg,
    },
    winnerHeader: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    winnerTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.sm,
    },
    restaurantImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
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
        padding: theme.spacing.md,
    },
    restaurantName: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    restaurantAddress: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
    },
    voteStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    statText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
        fontWeight: theme.typography.fontWeight.bold,
    },
    actionsCard: {
        marginTop: theme.spacing.lg,
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
}); 