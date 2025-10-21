import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

const Loading = ({
  variant = 'default',
  size = 'medium',
  fullScreen = false,
  style,
}) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary.main;
      case 'secondary':
        return theme.colors.secondary.main;
      case 'light':
        return theme.colors.background.paper;
      default:
        return theme.colors.text.primary;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'large';
    }
  };

  const Container = fullScreen ? View : View;

  return (
    <Container style={[
      styles.container,
      fullScreen && styles.fullScreen,
      style,
    ]}>
      <ActivityIndicator
        size={getSize()}
        color={getVariantColor()}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
});

export default Loading; 