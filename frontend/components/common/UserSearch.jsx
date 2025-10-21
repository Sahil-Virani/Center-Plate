import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../../styles/theme';
import TextInput from './TextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import userService from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

export default function UserSearch({ onSelect, selectedUsers, onRemove, error }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                setSearchError(null);
                return;
            }

            setLoading(true);
            setSearchError(null);
            try {
                const results = await userService.searchUsers(searchQuery);
                const filteredResults = results.filter(result => result._id !== user.uid);
                setSearchResults(filteredResults);
            } catch (error) {
                console.error('Error searching users:', error);
                setSearchError('Failed to search users. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const debounceTimeout = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, user.uid]);

    const handleSelect = (item) => {
        onSelect(item);
        setSearchQuery('');
        setSearchResults([]);
    };

    const renderSearchResult = (item) => {
        if (selectedUsers.some(selected => selected._id === item._id)) {
            return null;
        }
        
        return (
            <TouchableOpacity
                style={styles.searchResult}
                onPress={() => handleSelect(item)}
            >
                <Text style={styles.searchResultName}>{item.username}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                icon="search"
                error={error}
                onFocus={() => setShowDropdown(true)}
                autoCorrect={false}
            />

            {selectedUsers.length > 0 && (
                <View style={styles.selectedUsersContainer}>
                    <View style={styles.selectedUsersWrapper}>
                        {selectedUsers.map((user) => (
                            <View key={user._id} style={styles.selectedUser}>
                                <Text style={styles.selectedUserName}>{user.username}</Text>
                                
                                <TouchableOpacity
                                    onPress={() => onRemove(user._id)}
                                    style={styles.removeButton}
                                >
                                    <Icon name="times" size={16} color={theme.colors.text.primary} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {showDropdown && searchQuery.length >= 2 && (
                <View style={styles.searchResultsContainer}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Searching...</Text>
                        </View>
                    ) : searchError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{searchError}</Text>
                        </View>
                    ) : searchResults.length > 0 ? (

                        searchResults.map((item) => (
                            <View key={item._id}>
                                {renderSearchResult(item)}
                            </View>
                        ))

                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No users found</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    selectedUsersContainer: {
        marginTop: theme.spacing.sm,
    },
    selectedUsersWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    selectedUser: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.secondary.main,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    selectedUserName: {
        color: theme.colors.text.primary,
        marginRight: theme.spacing.sm,
    },
    removeButton: {
        padding: theme.spacing.xs,
    },
    searchResultsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background.paper,
        borderRadius: theme.borderRadius.md,
        marginTop: theme.spacing.xs,
        ...theme.shadows.md,
        zIndex: 1000,
        maxHeight: 200,
    },
    searchResultsList: {
        flexGrow: 1,
    },
    searchResult: {
        padding: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    searchResultName: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text.primary,
    },
    loadingContainer: {
        padding: theme.spacing.sm,
        alignItems: 'center',
    },
    loadingText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
    },
    errorContainer: {
        padding: theme.spacing.sm,
        alignItems: 'center',
    },
    errorText: {
        color: theme.colors.text.contrast,
        fontSize: theme.typography.fontSize.sm,
        textAlign: 'center',
    },
    emptyContainer: {
        padding: theme.spacing.sm,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
    },
});