import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

const Card = ({
  children,
  variant = 'default',
  elevation = 'md',
  style,
  contentStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary.main,
          borderColor: theme.colors.primary.dark,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary.main,
          borderColor: theme.colors.secondary.dark,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border.main,
        };
      default:
        return {
          backgroundColor: theme.colors.background.paper,
          borderColor: theme.colors.border.light,
        };
    }
  };

  const getElevationStyles = () => {
    switch (elevation) {
      case 'sm':
        return theme.shadows.sm;
      case 'lg':
        return theme.shadows.lg;
      default:
        return theme.shadows.md;
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[
      styles.container,
      variantStyles,
      getElevationStyles(),
      style,
    ]}>
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.md,
  },
});

export default Card; 