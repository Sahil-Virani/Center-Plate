import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../../styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({
  title,
  leftAction,
  rightAction,
  variant = 'default',
  showBackButton = false,
  onBackPress,
  style,
  titleStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary.main,
          titleColor: theme.colors.text.contrast,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary.main,
          titleColor: theme.colors.text.contrast,
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
          titleColor: theme.colors.text.primary,
        };
      default:
        return {
          backgroundColor: theme.colors.background.default,
          titleColor: theme.colors.text.primary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: variantStyles.backgroundColor }]}>
      <View style={[styles.container, style]}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Icon name="chevron-left" size={24} color={variantStyles.titleColor} />
            </TouchableOpacity>
          )}
          {leftAction}
        </View>

        <Text style={[
          styles.title,
          { color: variantStyles.titleColor },
          titleStyle
        ]}>
          {title}
        </Text>

        <View style={styles.rightSection}>
          {rightAction}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
});

export default Header; 