import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary.main,
          borderColor: theme.colors.secondary.dark,
          borderWidth: 1.5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          elevation: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary.main,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'danger':
          	return {
				backgroundColor: theme.colors.status.error,
				borderColor: theme.colors.status.error,
          	};
      default:
        return {
          backgroundColor: theme.colors.primary.main,
          borderColor: theme.colors.primary.dark,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        };
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.text.disabled;
    if (variant === 'outline' || variant === 'text') return theme.colors.primary.main;
    return theme.colors.text.contrast;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: size === 'small' ? theme.typography.fontSize.sm : theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button; 