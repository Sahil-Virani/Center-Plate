import React from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

const TextInput = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  helperTextStyle,
  autoCorrect = false,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputContainer,
        error && styles.inputError,
        props.editable === false && styles.inputDisabled
      ]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        <RNTextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.text.disabled}
          autoCorrect={autoCorrect}
          {...props}
        />
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          error && styles.errorText,
          helperTextStyle
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.default,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing.sm,
  },
  iconContainer: {
    paddingHorizontal: theme.spacing.sm,
    justifyContent: 'center',
  },
  helperText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.status.error,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  inputDisabled: {
    backgroundColor: theme.colors.background.paper,
    opacity: 0.7,
  },
});

export default TextInput; 