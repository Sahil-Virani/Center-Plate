import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import globalStyles from '../styles/GlobalStyles';
import { useAuth } from '../hooks/AuthContext';
import { useUserSearch } from '../hooks/useUserSearch';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ParticipantManagement({ participants, setParticipants }) {
    const { user } = useAuth();
    const {
        query: searchQuery,
        setQuery: setSearchQuery,
        results: searchResults,
        loading: searchLoading,
        error: searchError,
    } = useUserSearch();

    const addParticipant = useCallback((userToAdd) => {
        const alreadyAdded = participants.some(participant => participant.uid === userToAdd._id);
        if (alreadyAdded) {
            Alert.alert('Error', 'User is already added to the group');
            return;
        }

        if (userToAdd._id === user.uid) {
            Alert.alert('Error', 'You cannot add yourself to the group');
            return;
        }

        setParticipants((prevParticipants) => [
            ...prevParticipants,
            {
                uid: userToAdd._id,
                username: userToAdd.username,
                role: 'participant',
                invitation: 'pending'
            }
        ]);
        setSearchQuery('');
    }, [participants, user.uid]);

    const removeParticipant = useCallback((uid) => {
        Alert.alert(
            'Remove Participant',
            'Are you sure you want to remove this participant?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setParticipants((prevParticipants) =>
                            prevParticipants.filter((participant) => participant.uid !== uid)
                        );
                    },
                },
            ]
        );
    }, []);

    const changeRole = useCallback((uid, newRole) => {
        setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
                participant.uid === uid ? { ...participant, role: newRole } : participant
            )
        );
    }, []);

    const renderSearchResult = useCallback(({ item }) => (
        <TouchableOpacity
            style={styles.searchResultItem}
            onPress={() => addParticipant(item)}
        >
            <Icon name="user" size={20} color="#1976D2" style={styles.searchResultIcon} />
            <Text style={styles.searchResultText}>{item.username}</Text>
        </TouchableOpacity>
    ), [addParticipant]);

    const renderParticipant = useCallback(({ item }) => (
        <View style={styles.participantCard}>
            <View style={styles.participantInfo}>
                <Icon 
                    name={item.role === 'admin' ? 'star' : 'user'} 
                    size={20} 
                    color={item.role === 'admin' ? '#FFD700' : '#666'} 
                />
                <Text style={styles.participantName}>{item.username}</Text>
            </View>
            <View style={styles.actions}>
                {user.uid !== item.uid && (
                    <>
                        <TouchableOpacity
                            onPress={() => changeRole(item.uid, item.role === 'admin' ? 'participant' : 'admin')}
                            style={[styles.actionButton, styles.roleButton]}
                        >
                            <Icon
                                name={item.role === 'admin' ? 'arrow-down' : 'arrow-up'}
                                size={16}
                                color="#1976D2"
                            />
                            <Text style={styles.actionButtonText}>
                                {item.role === 'admin' ? 'Demote' : 'Promote'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => removeParticipant(item.uid)}
                            style={[styles.actionButton, styles.removeButton]}
                        >
                            <Icon name="times" size={16} color="#D32F2F" />
                            <Text style={[styles.actionButtonText, styles.removeText]}>Remove</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    ), [user.uid, changeRole, removeParticipant]);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                        placeholder="Search users to add..."
                        style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                />
                    {searchLoading && (
                        <ActivityIndicator size="small" color="#1976D2" style={styles.loadingIndicator} />
                    )}
                </View>

                {searchError && (
                    <Text style={styles.errorText}>{searchError}</Text>
                )}
        
                {searchResults.length > 0 && (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item._id}
                        renderItem={renderSearchResult}
                    style={styles.searchResultsOverlay}
                    keyboardShouldPersistTaps="handled"
                />
                )}
            </View>
    
            <View style={styles.participantsContainer}>
                <Text style={styles.sectionHeader}>Participants ({participants.length})</Text>
                <FlatList
                    data={participants}
                    keyExtractor={(item) => item.uid}
                    renderItem={renderParticipant}
                    style={styles.participantsList}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No participants added yet</Text>
                    }
                />
            </View>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        width: '100%',
        marginVertical: 10,
      },
      searchContainer: {
        position: 'relative',
        zIndex: 10,
      },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: '#333',
    },
    loadingIndicator: {
        marginLeft: 8,
      },
      searchResultsOverlay: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        maxHeight: 200,
        zIndex: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchResultIcon: {
        marginRight: 12,
      },
      searchResultText: {
        fontSize: 16,
        color: '#333',
    },
    participantsContainer: {
        marginTop: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    participantsList: {
        maxHeight: 300,
      },
      participantCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    participantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      participantName: {
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
      },
      actions: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 6,
        marginLeft: 8,
    },
    roleButton: {
        backgroundColor: '#E3F2FD',
    },
    removeButton: {
        backgroundColor: '#FFEBEE',
    },
    actionButtonText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
      },
      removeText: {
        color: '#D32F2F',
      },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        marginTop: 4,
      },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
      },
    });
