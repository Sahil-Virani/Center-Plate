import React from 'react';
import { View, StyleSheet, Image, Text} from 'react-native';
import { theme } from '../../styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserInfo = ({
  user,
  showEmail = true,
  showLocation = true,
  size = 'medium',
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return {
          avatar: 40,
          fontSize: theme.typography.fontSize.sm,
        };
      case 'large':
        return {
          avatar: 80,
          fontSize: theme.typography.fontSize.xl,
        };
      default:
        return {
          avatar: 60,
          fontSize: theme.typography.fontSize.md,
        };
    }
  };

  const sizes = getSize();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarContainer}>
        {user.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={[styles.avatar, { width: sizes.avatar, height: sizes.avatar }]}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { width: sizes.avatar, height: sizes.avatar }]}>
            <Icon
              name="user"
              size={sizes.avatar * 0.5}
              color={theme.colors.text.secondary}
            />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.name, { fontSize: sizes.fontSize }]}>
          {user.displayName || 'Anonymous User'}
        </Text>
        
        {showEmail && (
          <View style={styles.infoRow}>
            <Icon
              name="envelope"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.email}>{user.email}</Text>
          </View>
        )}

        {showLocation && user.location && (
          <View style={styles.infoRow}>
            <Icon
              name="map-marker"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.location}>
              {user.location.address || 'Location not set'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    borderRadius: theme.borderRadius.circle,
  },
  avatarPlaceholder: {
    borderRadius: theme.borderRadius.circle,
    backgroundColor: theme.colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  infoContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  email: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  location: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
});

export default UserInfo; 